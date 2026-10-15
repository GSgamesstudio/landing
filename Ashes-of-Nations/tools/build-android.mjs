import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";

const root = new URL("../", import.meta.url);
const androidDir = new URL("android/", root);
const manifestPath = new URL("android/app/src/main/AndroidManifest.xml", root);
const mainActivityPath = new URL("android/app/src/main/java/com/ashesofnations/game/MainActivity.java", root);
const apkPath = new URL("android/app/build/outputs/apk/debug/app-debug.apk", root);
const distApkPath = new URL("dist/Ashes-of-Nations-android-debug.apk", root);
const localSdkDir = new URL(".android-sdk/", root);
const localPropertiesPath = new URL("android/local.properties", root);
const localJdkDir = new URL(".jdk21/", root);

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || root,
      shell: true,
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
    child.on("error", reject);
  });
}

async function ensureLandscapePresentation() {
  const text = await readFile(manifestPath, "utf8");
  const updated = text.includes("android:screenOrientation=")
    ? text.replace(/android:screenOrientation="[^"]*"/, 'android:screenOrientation="landscape"')
    : text.replace(/(<activity\b[^>]*android:name="\.MainActivity")/, '$1 android:screenOrientation="landscape"');
  if (updated !== text) await writeFile(manifestPath, updated);

  const activity = await readFile(mainActivityPath, "utf8");
  if (activity.includes("hideSystemBars()")) return;
  const immersiveActivity = activity
    .replace("import com.getcapacitor.BridgeActivity;", `import com.getcapacitor.BridgeActivity;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;`)
    .replace(/public class MainActivity extends BridgeActivity \{\s*\}/, `public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        hideSystemBars();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemBars();
    }

    private void hideSystemBars() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.systemBars());
                controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN |
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            );
        }
    }
}`);
  if (immersiveActivity === activity) throw new Error("Не удалось настроить полноэкранный режим Android");
  await writeFile(mainActivityPath, immersiveActivity);
}

async function ensureAndroidSdk() {
  if (!existsSync(localSdkDir)) return;
  const sdkPath = decodeURIComponent(localSdkDir.pathname)
    .replace(/^\/([A-Za-z]:\/)/, "$1")
    .replace(/\//g, "\\");
  process.env.ANDROID_HOME = sdkPath;
  process.env.ANDROID_SDK_ROOT = sdkPath;
  await writeFile(localPropertiesPath, `sdk.dir=${sdkPath.replace(/\\/g, "\\\\")}\n`);
}

function ensureJavaHome() {
  if (!existsSync(localJdkDir)) return;
  const javaHome = decodeURIComponent(localJdkDir.pathname)
    .replace(/^\/([A-Za-z]:\/)/, "$1")
    .replace(/\//g, "\\");
  process.env.JAVA_HOME = javaHome;
  process.env.PATH = `${javaHome}\\bin;${process.env.PATH || ""}`;
}

async function copyApk() {
  await stat(apkPath);
  await mkdir(new URL("dist/", root), { recursive: true });
  await copyFile(apkPath, distApkPath);
  console.log(`Copied Android APK to ${distApkPath.pathname}`);
}

await run("npm", ["run", "build"]);
ensureJavaHome();
await ensureAndroidSdk();
if (!existsSync(androidDir)) {
  await run("npx", ["cap", "add", "android"]);
}
await run("npx", ["cap", "sync", "android"]);
ensureJavaHome();
await ensureAndroidSdk();
await ensureLandscapePresentation();
await run(".\\gradlew.bat", ["assembleDebug"], { cwd: androidDir });
await copyApk();

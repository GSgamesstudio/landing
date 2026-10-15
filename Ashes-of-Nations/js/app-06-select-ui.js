(() => {
  const selector = "select.strategy-select:not(.settings-native-select)";
  let controlId = 0;
  let openControl = null;

  function selectedOption(select) {
    return select.options[select.selectedIndex] || null;
  }

  function updateControl(select) {
    const control = select._gameSelectControl;
    if (!control) return;
    const trigger = control.querySelector(".game-select-trigger");
    const value = control.querySelector(".game-select-value");
    const option = selectedOption(select);
    value.textContent = option?.textContent.trim() || select.getAttribute("aria-label") || "Выберите вариант";
    trigger.disabled = select.disabled || select.options.length === 0;
    trigger.setAttribute("aria-expanded", String(Boolean(control._gameSelectMenu)));
    trigger.setAttribute("aria-label", `${select.getAttribute("aria-label") || "Выбор"}: ${value.textContent}`);
  }

  function closeControl(control, restoreFocus = false) {
    if (!control?._gameSelectMenu) return;
    const trigger = control.querySelector(".game-select-trigger");
    control._gameSelectMenu.remove();
    control._gameSelectMenu = null;
    trigger.setAttribute("aria-expanded", "false");
    control.classList.remove("is-open");
    if (openControl === control) openControl = null;
    if (restoreFocus) trigger.focus();
  }

  function closeOpenControl() {
    if (openControl) closeControl(openControl);
  }

  function positionMenu(control) {
    const menu = control?._gameSelectMenu;
    if (!menu) return;
    const trigger = control.querySelector(".game-select-trigger");
    const anchor = trigger.getBoundingClientRect();
    const width = Math.min(Math.max(anchor.width, menu.classList.contains("game-select-menu-cards") ? 288 : 250), window.innerWidth - 20, 460);
    menu.style.width = `${Math.max(200, width)}px`;
    menu.style.maxHeight = `${Math.min(Math.floor(window.innerHeight * 0.58), 440)}px`;
    menu.style.visibility = "hidden";
    const height = menu.getBoundingClientRect().height;
    const below = window.innerHeight - anchor.bottom - 12;
    const top = below >= Math.min(height, 240)
      ? Math.min(anchor.bottom + 6, window.innerHeight - height - 10)
      : Math.max(10, anchor.top - height - 6);
    const left = Math.max(10, Math.min(anchor.left, window.innerWidth - width - 10));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.style.visibility = "visible";
  }

  function optionIsDisabled(option) {
    return option.disabled || Boolean(option.closest("optgroup")?.disabled);
  }

  function openMenu(select, control) {
    if (select.disabled || !select.options.length) return;
    closeOpenControl();
    updateControl(select);

    const options = Array.from(select.options);
    const menu = document.createElement("div");
    menu.className = `game-select-menu${options.length <= 8 ? " game-select-menu-cards" : ""}`;
    menu.id = `game-select-menu-${++controlId}`;
    menu.setAttribute("role", "listbox");
    menu.setAttribute("aria-label", select.getAttribute("aria-label") || control.querySelector(".game-select-value").textContent);
    menu.addEventListener("pointerdown", (event) => event.stopPropagation());

    const query = options.length > 10 ? document.createElement("input") : null;
    if (query) {
      query.className = "game-select-search";
      query.type = "search";
      query.placeholder = "Поиск вариантов…";
      query.setAttribute("aria-label", "Поиск вариантов");
      menu.append(query);
    }

    const list = document.createElement("div");
    list.className = "game-select-options";
    menu.append(list);

    const renderOptions = () => {
      const needle = query?.value.trim().toLocaleLowerCase() || "";
      list.replaceChildren();
      options.forEach((option, index) => {
        if (needle && !option.textContent.toLocaleLowerCase().includes(needle)) return;
        const item = document.createElement("button");
        item.className = "game-select-option";
        item.type = "button";
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", String(index === select.selectedIndex));
        item.disabled = optionIsDisabled(option);
        item.textContent = option.textContent.trim();
        item.addEventListener("click", () => {
          if (select.value !== option.value || select.selectedIndex !== index) {
            select.selectedIndex = index;
            select.dispatchEvent(new Event("change", { bubbles: true }));
          }
          updateControl(select);
          closeControl(control, true);
        });
        item.addEventListener("keydown", (event) => {
          if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
          event.preventDefault();
          const available = Array.from(list.querySelectorAll(".game-select-option:not(:disabled)"));
          const nextIndex = available.indexOf(item) + (event.key === "ArrowDown" ? 1 : -1);
          available[(nextIndex + available.length) % available.length]?.focus();
        });
        list.append(item);
      });
      if (!list.children.length) {
        const empty = document.createElement("p");
        empty.className = "game-select-empty";
        empty.textContent = "Ничего не найдено";
        list.append(empty);
      }
    };

    query?.addEventListener("input", renderOptions);
    renderOptions();
    document.body.append(menu);
    control._gameSelectMenu = menu;
    control.classList.add("is-open");
    control.querySelector(".game-select-trigger").setAttribute("aria-expanded", "true");
    openControl = control;

    positionMenu(control);

    if (query && !matchMedia("(pointer: coarse)").matches) query.focus();
    else if (!query) (list.querySelector('[aria-selected="true"]:not(:disabled)') || list.querySelector(".game-select-option:not(:disabled)"))?.focus();
  }

  function enhance(select) {
    if (select._gameSelectControl || select.multiple || select.classList.contains("settings-native-select")) return;
    select.classList.add("game-native-select");

    const control = document.createElement("span");
    control.className = "game-select-control";
    control.innerHTML = '<button class="game-select-trigger" type="button" aria-haspopup="listbox" aria-expanded="false"><span class="game-select-value"></span><span class="game-select-chevron" aria-hidden="true"></span></button>';
    select.insertAdjacentElement("afterend", control);
    select._gameSelectControl = control;
    control._gameSelect = select;
    updateControl(select);

    const trigger = control.querySelector(".game-select-trigger");
    trigger.addEventListener("click", () => {
      if (control._gameSelectMenu) closeControl(control);
      else openMenu(select, control);
    });
    trigger.addEventListener("keydown", (event) => {
      if (["ArrowDown", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openMenu(select, control);
      }
    });
    select.addEventListener("change", () => updateControl(select));
    select.addEventListener("input", () => updateControl(select));
  }

  function scan(root) {
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    if (root.matches(selector)) enhance(root);
    root.querySelectorAll(selector).forEach(enhance);
  }

  scan(document.body);
  new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach(scan);
      if (record.target instanceof HTMLSelectElement) updateControl(record.target);
    });
  }).observe(document.body, { childList: true, subtree: true });

  document.addEventListener("pointerdown", (event) => {
    if (openControl && !openControl.contains(event.target) && !openControl._gameSelectMenu?.contains(event.target)) closeOpenControl();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && openControl) closeControl(openControl, true);
  });
  window.addEventListener("resize", () => openControl && positionMenu(openControl));
  window.visualViewport?.addEventListener("resize", () => openControl && positionMenu(openControl));
  document.addEventListener("scroll", (event) => {
    if (openControl && !openControl._gameSelectMenu?.contains(event.target)) closeOpenControl();
  }, true);
})();

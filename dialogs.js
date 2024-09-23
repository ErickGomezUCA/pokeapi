const source = "https://pokeapi.co/api/v2/";

// Create
function createButton(
  className,
  iconString,
  event = { callback: null, target: null }
) {
  const button = document.createElement("button");
  button.className = className;

  const icon = document.createElement("i");
  icon.className = "material-symbols-outlined";
  icon.textContent = iconString;

  button.appendChild(icon);

  if (event) {
    const { callback, target } = event;

    button.addEventListener("click", () => {
      callback(target);
    });
  }

  return button;
}

async function createPokemon(pokemon) {
  const main = document.createElement("li");
  const container = document.createElement("div");
  const info = document.createElement("div");
  const id = document.createElement("span");
  const name = document.createElement("span");
  const types = document.createElement("span");
  const img = document.createElement("img");
  const buttons = document.createElement("div");

  main.className = "pokemon-container";

  container.className = "pokemon";
  container.setAttribute("type", pokemon.types[0].type.name);

  info.className = "info";

  id.className = "id";
  id.textContent = `#${String(pokemon.id).padStart(4, "0")}`;

  name.className = "name";
  name.textContent = pokemon.name.capitalize();

  types.className = "types";
  pokemon.types.forEach((t) => {
    const type = document.createElement("span");
    type.className = "type";
    type.textContent = t.type.name.toUpperCase();

    types.append(type);
  });

  img.src = pokemon.sprites.other["official-artwork"].front_default;

  info.append(id, name, types);
  container.append(info, img);

  buttons.className = "buttons";

  const editButton = createButton("edit-button", "edit", {
    callback: showEditDialog,
    target: main,
  });
  const deleteButton = createButton("delete-button", "delete", {
    callback: showDeleteDialog,
    target: main,
  });

  buttons.append(editButton, deleteButton);

  container.setAttribute("api-link", `pokemon/${pokemon.name}`);

  container.addEventListener("click", () => showInfoDialog(pokemon));

  main.append(container, buttons);
  return main;
}

// Edit

function showEditDialog(pokemon) {
  const dialog = document.querySelector("dialog#edit-pokemon");
  const input = dialog.querySelector("input#new-name");
  const form = dialog.querySelector("form#edit-form");
  const pokemonName = pokemon.querySelector(".name");

  input.value = pokemonName.textContent;

  form.onsubmit = (e) => {
    e.preventDefault();

    if (Boolean(input.value)) {
      editPokemon(pokemon, input.value);
      form.submit();
    }
  };

  dialog.showModal();
}

function editPokemon(pokemon, value) {
  const name = pokemon.querySelector(".name");

  name.textContent = value;
}

// Delete
function showDeleteDialog(pokemon) {
  const dialog = document.querySelector("dialog#delete-pokemon");
  const deleteButton = dialog.querySelector("button.primary");

  // Reset event
  deleteButton.onclick = () => deletePokemon(pokemon);

  dialog.showModal();
}

function deletePokemon(pokemon) {
  pokemon.remove();
}

// Others
function showAlertDialog(icon, message) {
  const dialog = document.querySelector("dialog#alert");
  const iconNode = dialog.querySelector(".icon");
  const messageNode = dialog.querySelector(".message");

  iconNode.textContent = icon;
  messageNode.textContent = message;

  dialog.showModal();
}

function updateTypes(dialog, pokemon) {
  const typesContainer = dialog.querySelector(".types");

  typesContainer.innerHTML = "";
  pokemon.types.forEach((t) => {
    const type = document.createElement("span");
    type.className = "type";
    type.textContent = t.type.name.toUpperCase();

    typesContainer.append(type);
  });
}

function updateDetails(dialog, pokemon) {
  const abilitiesContainer = dialog.querySelector(".abilities");

  abilitiesContainer.innerHTML = "";
  pokemon.abilities.forEach((abilityElement) => {
    const container = document.createElement("div");
    container.className = "ability";
    const icon = document.createElement("i");
    icon.className = "icon material-symbols-outlined fill";
    icon.textContent = "star";

    const abilityLabel = document.createElement("p");
    abilityLabel.className = "ability-label";
    abilityLabel.textContent = abilityElement.ability.name.capitalize();

    container.append(icon, abilityLabel);

    abilitiesContainer.append(container);
  });
}

function updateStats(dialog, pokemon) {
  const hp = dialog.querySelector(".hp");
  const attack = dialog.querySelector(".attack");
  const defense = dialog.querySelector(".defense");
  const specialAttack = dialog.querySelector(".special-attack");
  const specialDefense = dialog.querySelector(".special-defense");
  const speed = dialog.querySelector(".speed");

  hp.textContent = pokemon.stats[0].base_stat;
  attack.textContent = pokemon.stats[1].base_stat;
  defense.textContent = pokemon.stats[2].base_stat;
  specialAttack.textContent = pokemon.stats[3].base_stat;
  specialDefense.textContent = pokemon.stats[4].base_stat;
  speed.textContent = pokemon.stats[5].base_stat;
}

function showInfoDialog(pokemon) {
  const dialog = document.querySelector("dialog#info");
  const id = dialog.querySelector(".id");
  const name = dialog.querySelector(".name");
  const img = dialog.querySelector(".img");
  const height = dialog.querySelector(".height");
  const weight = dialog.querySelector(".weight");

  dialog.setAttribute("type", pokemon.types[0].type.name);

  id.textContent = `#${String(pokemon.id).padStart(4, "0")}`;
  name.textContent = pokemon.name.capitalize();
  img.src = pokemon.sprites.other["official-artwork"].front_default;
  height.textContent = `${pokemon.height} ft`;
  weight.textContent = `${pokemon.weight} lb`;

  updateTypes(dialog, pokemon);
  updateDetails(dialog, pokemon);
  updateStats(dialog, pokemon);

  dialog.showModal();
}

// Set up
function setUpCreatePokemonForm() {
  const form = document.forms["pokemon-form"];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const input = form.querySelector("input#person-name");

    // Avoid empty values
    if (!input.value) return;
    try {
      const request = await fetch(
        `${source}pokemon/${input.value.toLowerCase()}`
      );
      const pokemon = await request.json();

      const container = document.querySelector(".pokemons");
      container.appendChild(await createPokemon(pokemon));
      input.value = "";
    } catch (e) {
      showAlertDialog("error", "Pokemon not found");
    }
  });
}

function setUpEditDialog() {
  const editDialog = document.querySelector("dialog#edit-pokemon");
  const editForm = editDialog.querySelector("form#edit-form");
  const input = editDialog.querySelector("input#new-name");
  const editButton = editDialog.querySelector("button.primary");

  input.addEventListener("input", () => (editButton.disabled = !input.value));
}

export { setUpCreatePokemonForm, setUpEditDialog };

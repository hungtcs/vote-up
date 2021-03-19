
/**
 * @type HTMLFormElement
 */
let submitting = false;
const form = document.querySelector('#form');
const addOptionButton = document.querySelector('button[action="add-option"]');

form.addEventListener('submit', async event => {
  event.preventDefault();
  event.stopPropagation();

  if(submitting || !form.checkValidity()) {
    return;
  }
  submitting = true;
  const title = form.querySelector('input[name="title"]').value;
  const options = Array.from(form.querySelectorAll('[field="options"] > div > section > input')).map(input => ({ title: input.value }));

  console.log({ title, options });
  try {
    const response = await fetch(`create`, { method: 'PUT', body: JSON.stringify({ title, options }), headers: { 'Content-Type': 'application/json; charset=utf-8' } });
    if(response.status !== 201) {
      throw new Error(await response.json());
    }
    window.location.assign('/');
  } catch(err) {
    submitting = false;
    alert(err.message);
  }
});

addOptionButton.addEventListener('click', () => {
  const section = document.createElement('section');
  section.innerHTML = `<input type="text" required /><a><mat-icon>remove</mat-icon></a>`;
  section.querySelector('a').addEventListener('click', () => {
    section.remove();
  });
  addOptionButton.parentElement.insertBefore(section, addOptionButton);
});

addOptionButton.dispatchEvent(new Event('click'));
addOptionButton.dispatchEvent(new Event('click'));

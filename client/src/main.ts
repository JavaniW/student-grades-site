import "./style.css";

const form: HTMLFormElement | null =
  document.querySelector(".submit-grade-form");
const submitFormButton: HTMLButtonElement | null = document.querySelector(
  ".submit-grade-form__button"
)!;

form?.addEventListener("submit", (e: Event) => {
  console.log("Submitted");
  e.preventDefault();

  const data = new FormData(form, submitFormButton);
  let payload = {};
  for (const [key, value] of data) {
    payload = { ...payload, [key]: value };
    console.log(`Key: ${key} Value: ${value}`);
  }

  fetch(`http://localhost:8080/api`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then(
    () => {
      form.reset();
      console.log(JSON.stringify(payload));
      console.log("Student Grade Added Successfully.");
    },
    (e: any) => {
      console.log(e);
      console.log("Student Grade Could Not Be Added.");
    }
  );
});

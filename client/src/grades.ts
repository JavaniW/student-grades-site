const gradesTableBody: HTMLElement | null =
  document.querySelector(".table-body");
const gradesTableFoot: HTMLElement | null =
  document.querySelector(".table-footer");

fetch("http://ec2-52-91-57-51.compute-1.amazonaws.com:8080/api")
  .then((res) => res.json())
  .then((res) => {
    if (!gradesTableBody) return;
    let sum = 0;
    res.forEach(({ id, grade }: { id: number; grade: number }) => {
      sum += +grade;
      gradesTableBody!.innerHTML += `<tr>
<td>${id}</td>
<td>${grade}</td>
</tr>`;
    });
    console.log(`Sum is: ${sum}`);
    gradesTableFoot!.innerHTML += (sum / res.length).toFixed(2);
  });

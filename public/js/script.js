// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

document.addEventListener("DOMContentLoaded", () => {
  // Desktop Tax Switch
  let desktopTaxSwitch = document.getElementById("flexSwitchCheckDefault");
  if (desktopTaxSwitch) {
    desktopTaxSwitch.addEventListener("click", toggleTaxInfo);
  }

  // Mobile Tax Switch
  let mobileTaxSwitch = document.getElementById("mobileTaxToggle");
  if (mobileTaxSwitch) {
    mobileTaxSwitch.addEventListener("click", toggleTaxInfo);
  }

  function toggleTaxInfo() {
    let taxInfoElements = document.getElementsByClassName("tax-info");
    for (let info of taxInfoElements) {
      info.style.display = info.style.display !== "inline" ? "inline" : "none";
    }
  }
});

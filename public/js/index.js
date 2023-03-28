$(document).ready(() => {
  // Retrieve the selected theme from local storage
  let selectedTheme = localStorage.getItem("selectedTheme");

  // Set the selected theme if it exists in local storage
  if (selectedTheme) {
    $("body").addClass(selectedTheme);
  }

  $(".theme-tag").click(function () {
    let sel = $(this).attr("id");
    if (sel === "def") {
      $("body").removeClass();
      $("body").addClass("ok");

      // Save the selected theme to local storage
      localStorage.setItem("selectedTheme", "ok");
    } else if (sel === "lig") {
      $("body").removeClass();
      $("body").addClass("theme1");

      // Save the selected theme to local storage
      localStorage.setItem("selectedTheme", "theme1");
    } else {
      $("body").removeClass();
      $("body").addClass("theme2");

      // Save the selected theme to local storage
      localStorage.setItem("selectedTheme", "theme2");
    }
  });

  $("#rmDiv").click(() => {
    $("#mainFrm").remove();
    $("#new-list-form").show();
    $("#listHeading").text("Create A New Do This List");
  });
});

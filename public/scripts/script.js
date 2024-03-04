$(document).ready(() => {
  const review = $("#review").val();
  for (var i = 1; i <= review; i++) {
    $(`#star${i}`).css("color", "black");
  }
});

function rating(rateValue) {
  $("#review").val(rateValue);
  $(".star").css("color", "white");
  for (var i = 1; i <= rateValue; i++) {
    $(`#star${i}`).css("color", "black");
  }
};

const date = new Date();
$("footer").html("<p>Copy rights © " + date.getFullYear() + "</p>");

$("#submit").click(() => {
  $("#form").submit();
});
const date = new Date();
$("footer").html("<p>Copy rights © " + date.getFullYear() + "</p>");

$(".btn-danger").click(() => {
    return confirm("Are you sure you want to delete this book?");
});
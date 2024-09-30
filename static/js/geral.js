function exibirNotificacao(message, isErro) {
  var toast = new bootstrap.Toast($("#notificacaoToast"));

  $("#notificacaoToast .toast-body").text(message);

  if (isErro) {
    $("#notificacaoToast .toast-body").addClass("text-danger");
  } else {
    $("#notificacaoToast .toast-body").removeClass("text-danger");
  }

  toast.show();
}

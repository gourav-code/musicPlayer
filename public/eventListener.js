document.addEventListener("click", e => {
  if (e.target.matches(".my-songs")) {
    document.getElementById("itemId").value = e.target.textContent;
    document.getElementById("myForm").submit();
    
  }
});

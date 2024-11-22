var inputsLogin = document.querySelectorAll(".input");

function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
  let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
  }
}

inputsLogin.forEach(input => {
	input.addEventListener("focus", addcl);
  input.addEventListener("blur", remcl);
});

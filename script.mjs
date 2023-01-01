window.addEventListener('load', function() { 
  const canvas = document.querySelector('#canvas0');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log(ctx)
});

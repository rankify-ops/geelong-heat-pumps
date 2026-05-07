// Geelong Heat Pumps shared JS
(function(){
  // Nav scroll state
  var nav = document.getElementById('nav');
  if(nav){
    var setScrolled = function(){ nav.classList.toggle('scrolled', window.scrollY > 50); };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive:true });
  }
  // Mobile drawer
  var tog = document.querySelector('.mob-tog');
  var drawer = document.querySelector('.mdrawer');
  if(tog && drawer){
    tog.addEventListener('click', function(){
      tog.classList.toggle('open');
      drawer.classList.toggle('open');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        tog.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow='';
      });
    });
  }
  // Fade-in
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('vis'); io.unobserve(x.target); }});
    }, { threshold:0.1, rootMargin:'0px 0px -30px 0px' });
    document.querySelectorAll('.fade').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.fade').forEach(function(el){ el.classList.add('vis'); });
  }
  // Smooth-scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(ev){
      var hash = a.getAttribute('href');
      if(hash.length<=1) return;
      var t = document.querySelector(hash);
      if(t){ ev.preventDefault(); t.scrollIntoView({ behavior:'smooth', block:'start' }); }
    });
  });
  // Quote form (multi-step)
  var qform = document.querySelector('.qform');
  if(qform){
    var cs=1, fd={};
    var slides = qform.querySelectorAll('.fslide');
    var steps = qform.querySelectorAll('.fstep');
    var maxStep = slides.length - 1; // last is success
    var upd = function(){
      slides.forEach(function(s){ s.classList.remove('active'); });
      var slide = qform.querySelector('.fslide[data-s="'+cs+'"]');
      if(slide) slide.classList.add('active');
      steps.forEach(function(s,i){
        s.classList.remove('active','done');
        if(i+1===cs) s.classList.add('active');
        if(i+1<cs) s.classList.add('done');
      });
    };
    qform.querySelectorAll('.ob').forEach(function(b){
      b.addEventListener('click', function(){
        var grp = b.closest('.og');
        grp.querySelectorAll('.ob').forEach(function(x){ x.classList.remove('sel'); });
        b.classList.add('sel');
        var slide = b.closest('.fslide');
        fd['s'+slide.dataset.s] = b.dataset.v;
      });
    });
    qform.querySelectorAll('.fn').forEach(function(btn){
      btn.addEventListener('click', function(){
        if(btn.dataset.action === 'submit'){
          var inputs = qform.querySelectorAll('.fslide[data-s="'+cs+'"] .finp');
          var allFilled = true;
          inputs.forEach(function(i){ if(!i.value.trim()) allFilled = false; });
          if(!allFilled){ alert('Please fill in all fields'); return; }
          inputs.forEach(function(i){ fd[i.id||i.name] = i.value; });
          cs = maxStep + 1;
          slides.forEach(function(s){ s.classList.remove('active'); });
          var done = qform.querySelector('.fslide[data-s="'+cs+'"]');
          if(done) done.classList.add('active');
          steps.forEach(function(s){ s.classList.remove('active'); s.classList.add('done'); });
          return;
        }
        if(cs >= maxStep) return;
        var sel = qform.querySelector('.fslide[data-s="'+cs+'"] .ob.sel');
        if(cs<=3 && !sel) return;
        cs++; upd();
      });
    });
    qform.querySelectorAll('.fb').forEach(function(b){
      b.addEventListener('click', function(){ if(cs<=1) return; cs--; upd(); });
    });
  }
})();

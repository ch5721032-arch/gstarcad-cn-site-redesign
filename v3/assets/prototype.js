(function(){
  var pages = Array.prototype.slice.call(document.querySelectorAll(".page"));
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".proto-tabs button"));
  var header = document.getElementById("siteHeader");
  var navItems = Array.prototype.slice.call(document.querySelectorAll(".nav-item.has-mega"));
  var mobileToggle = document.getElementById("mobileToggle");

  function showPage(id, pushHash){
    var target = document.getElementById("page-" + id);
    if(!target) return;
    pages.forEach(function(p){ p.classList.toggle("active", p === target); });
    tabs.forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-target") === id); });
    if(pushHash !== false){ history.replaceState(null, "", "#" + id); }
    window.scrollTo(0, 0);
    closeAll(null);
  }

  tabs.forEach(function(btn){
    btn.addEventListener("click", function(){ showPage(btn.getAttribute("data-target")); });
  });

  Array.prototype.slice.call(document.querySelectorAll("[data-page]")).forEach(function(el){
    el.addEventListener("click", function(e){
      e.preventDefault();
      var targetPage = el.getAttribute("data-page");
      showPage(targetPage);
      var scrollTarget = el.getAttribute("data-scroll");
      if(scrollTarget){
        setTimeout(function(){
          var node = document.getElementById(scrollTarget);
          if(node) node.scrollIntoView({behavior:"smooth", block:"start"});
        }, 60);
      }
    });
  });

  var initial = location.hash ? location.hash.replace("#","") : "home";
  showPage(initial, false);

  function isDesktop(){ return window.matchMedia("(min-width: 992px)").matches; }
  function closeAll(except){
    navItems.forEach(function(item){
      if(item === except) return;
      item.classList.remove("open");
      var link = item.querySelector(".nav-link");
      if(link) link.setAttribute("aria-expanded","false");
    });
  }
  function openItem(item){
    closeAll(item);
    item.classList.add("open");
    var link = item.querySelector(".nav-link");
    if(link) link.setAttribute("aria-expanded","true");
  }

  navItems.forEach(function(item){
    var link = item.querySelector(".nav-link");
    var timer = null;
    item.addEventListener("mouseenter", function(){
      if(isDesktop()){ clearTimeout(timer); openItem(item); }
    });
    item.addEventListener("mouseleave", function(){
      if(isDesktop()){
        clearTimeout(timer);
        timer = setTimeout(function(){
          item.classList.remove("open");
          if(link) link.setAttribute("aria-expanded","false");
        }, 140);
      }
    });
    if(link){
      link.addEventListener("click", function(e){
        if(isDesktop()) return;
        e.preventDefault();
        if(item.classList.contains("open")){
          item.classList.remove("open");
          link.setAttribute("aria-expanded","false");
        } else {
          openItem(item);
        }
      });
    }
  });

  document.addEventListener("click", function(e){
    if(!e.target.closest(".nav-item.has-mega")) closeAll(null);
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
      closeAll(null);
      document.body.classList.remove("nav-open");
      if(mobileToggle) mobileToggle.setAttribute("aria-expanded","false");
    }
  });

  if(mobileToggle){
    mobileToggle.addEventListener("click", function(){
      var open = document.body.classList.toggle("nav-open");
      mobileToggle.setAttribute("aria-expanded", open ? "true" : "false");
      var use = mobileToggle.querySelector("use");
      if(use) use.setAttribute("href", open ? "#i-close" : "#i-menu");
    });
  }

  window.addEventListener("scroll", function(){
    if(header) header.classList.toggle("scrolled", window.scrollY > 8);
  }, {passive:true});

  var form = document.getElementById("leadForm");
  var success = document.getElementById("formSuccess");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var required = ["name","company","phone"];
      var ok = true;
      required.forEach(function(id){
        var el = document.getElementById(id);
        if(!el) return;
        if(!el.value.trim()){ el.style.borderColor = "#C0392B"; ok = false; }
        else { el.style.borderColor = ""; }
      });
      if(!ok) return;
      if(success){
        success.classList.add("show");
        success.scrollIntoView({behavior:"smooth", block:"center"});
      }
      form.reset();
    });
  }
})();

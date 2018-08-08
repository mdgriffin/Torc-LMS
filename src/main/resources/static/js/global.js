(function () {

    let navDropdowns = document.querySelectorAll('#primaryNav .nav-item.dropdown');

    navDropdowns.forEach(navDropdown => {
        let dropdownEl = navDropdown.querySelector('.dropdown-menu');
        navDropdown.addEventListener('click', (e) => {
            dropdownEl.classList.toggle('show');
        })

        window.addEventListener('click', function(e){
            if (!navDropdown.contains(e.target) && dropdownEl.classList.contains('show')){
                dropdownEl.classList.remove('show')
            }
        });

    });

})();
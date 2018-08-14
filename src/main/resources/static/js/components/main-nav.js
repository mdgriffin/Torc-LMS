const MainNav = (function () {

    const template = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    
            <div class="navbar-brand">
                <a>Team Torc LMS</a>
            </div>
    
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
    
            <div class="collapse navbar-collapse">
    
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <router-link to="/locked" class="nav-link" :active-class="'active'">Assignment Unlock</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/users" class="nav-link" :active-class="'active'">Users</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/statistics" class="nav-link" :active-class="'active'">Statistics</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/assign-course" class="nav-link" :active-class="'active'">Assign Course</router-link>
                    </li>
                    <li class="nav-item"><a href="/teamtorc-lms/logout" class="nav-link">Logout</a></li>
                </ul>
            </div>
        </nav>
    `;

    return {
        template: template
    }
})();
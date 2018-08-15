/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Blog Posts",
      posts: [],
      postModal: ""
    };
  },
  created: function() {
    axios.get("/v1/posts").then(function(response) {
      console.log("loading at the start");
      console.log(response.data);
      this.posts = response.data;
    }.bind(this));
  },
  methods: {
    selectedPost: function(thisPost) {
      axios.get("/v1/posts/" + this.$route.params.id).then(function(response) {
        console.log("getting the post");
        this.postModal = thisPost;
        console.log(this.postModal);
      }.bind(this));
    }
  },
  computed: {}
};

var SignupPage = {
  template: "#signup-page",
  data: function() {
    return {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation
      };
      axios
        .post("/v1/users", params)
        .then(function(response) {
          router.push("/login");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var LoginPage = {
  template: "#login-page",
  data: function() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        auth: {
          email: this.email, password: this.password
        }
      };
      axios
        .post("/user_token", params)
        .then(function(response) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = ["Invalid email or password."];
            this.email = "";
            this.password = "";
          }.bind(this)
        );
    }
  }
};

var LogoutPage = {
  template: "<h1>Logout</h1>",
  created: function() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/");
  }
};

var BlogNewPage = {
  template: "#blog-new-page",
  data: function() {
    return {
      title: "",
      body: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        title: this.title,
        body: this.body,
      };
      axios
        .post("/v1/posts", params)
        .then(function(response) {
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var BlogEditPage = {
  template: "#blog-edit-page",
  data: function() {
    return {
      title: "",
      body: "",
      errors: []
    };
  },
  created: function() {
    axios.get("/v1/posts/" + this.$route.params.id).then(function(response) {
      console.log("loading at the start");
      console.log(response.data);
      // this.posts = response.data;
      this.title = response.data.title;
      this.body = response.data.body;
    }.bind(this));
  },
  methods: {
    submit: function() {
      var params = {
        title: this.title,
        body: this.body,
      };
      axios
        .patch("/v1/posts/" + this.$route.params.id, params)
        .then(function(response) {
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/signup", component: SignupPage },
    { path: "/login", component: LoginPage },
    { path: "/logout", component: LogoutPage },
    { path: "/v1/posts/new", component: BlogNewPage },
    { path: "/v1/posts/:id/edit", component: BlogEditPage }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router,
  created: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
    console.log("jwt");
    console.log(jwt);
  }
});
export const fetchTasktypesMixin = {
  data() {
    return {
      tasktypes: []
    };
  },
  created() {
    this.fetchTasktypes();
  },
  methods: {
    fetchTasktypes() {
      axios
        .get(
          process.env.ROOT_API +
            "/auth/group/" +
            this.$route.params.id +
            "/tasktypes"
        )
        .then(response => {
          this.tasktypes = response.data.tasktypes;
          this.tasktypes.forEach(element => (element.show = true));
        })
        .catch(error => {
          console.warn(error.response);
        });
    }
  }
};

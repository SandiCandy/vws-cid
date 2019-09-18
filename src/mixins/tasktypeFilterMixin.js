export const tasktypeFilterMixin = {
  data() {
    return {
      tasktypes: []
    };
  },
  created() {
    this.readTasktypeFilter();
  },
  computed: {
    filteredTasktypes() {
      return this.tasktypes.reduce(function(filtered, option) {
        if (option.show) {
          filtered.push(option.id);
        }
        return filtered;
      }, []);
    }
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
          console.log(error.response);
        });
    },
    readTasktypeFilter() {
      if (localStorage.getItem(this.$route.params.id)) {
        this.tasktypes = JSON.parse(
          localStorage.getItem(this.$route.params.id)
        );
      } else {
        this.fetchTasktypes();
      }
    }
  }
};

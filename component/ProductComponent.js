export default {
  props: ["selectProduct", 'addToCart'],
  template: "#userProductModal",
  data() {
    return {
      bsProdModal: null,
      qty: 1,
    };
  },
  methods: {
    open() {
      this.bsProdModal.show();
    },
    close() {
      this.bsProdModal.hide();
    },
  },
  watch: {
    selectProduct() {
      this.qty = 1;
    }
  },
  mounted() {
    // $refs: 是選取DOM元素，建立物件實體
    this.bsProdModal = new bootstrap.Modal(this.$refs.modal);
  },
};

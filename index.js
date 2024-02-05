
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11.10.4/+esm";

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

// 使用 Object.keys 將 AllRules 轉為陣列並使用 forEach 迴圈將驗證規則加入 VeeValidate
Object.keys(VeeValidateRules).forEach((rule) => {
  defineRule(rule, VeeValidateRules[rule]);
});

// Downloads and merges the locale from URL
// 'https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json'
loadLocaleFromURL("./i18n/zh_TW.json");

// Activate the locale
configure({
  generateMessage: localize('zh_TW'),
  // validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const { Modal } = bootstrap;
import productModal from "./component/ProductComponent.js";

const baseUrl = "https://vue3-course-api.hexschool.io/v2";
const path = "sasimi";

const app = Vue.createApp({
  data() {
    return {
      isLoading: false,
      productModal: null,
      products: [],
      carts: {},
      selectProduct: {},
      status: {
        addCartLoading: "",
        cartQtyLoading: "",
        delCartLoading: "",
      },
      formParams: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      }
    };
  },
  methods: {
    getProducts() {
      const url = `${baseUrl}/api/${path}/products/all`;
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.status}`,
            text: err.data.message,
            confirmButtonText: "OK",
          });
        });
    },
    addToCart(product_id, qty = 1) {
      const url = `${baseUrl}/api/${path}/cart`;
      const order = {
        product_id,
        qty,
      };
      // loading in button
      this.status.addCartLoading = product_id;
      axios
        .post(url, { data: order })
        .then((res) => {
          this.status.addCartLoading = "";
          this.getCarts();
          this.closeModal();
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.status}`,
            text: err.data.message,
            confirmButtonText: "OK",
          });
        });
    },
    getCarts() {
      const url = `${baseUrl}/api/${path}/cart`;
      axios
        .get(url)
        .then((res) => {
          this.carts = res.data.data;
          this.isLoading = false;
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.status}`,
            text: err.data.message,
            confirmButtonText: "OK",
          });
        });
    },
    changeCartQty(id, product_id, qty = 1) {
      const url = `${baseUrl}/api/${path}/cart/${id}`;
      const order = {
        product_id,
        qty,
      };
      this.status.cartQtyLoading = id;
      axios
        .put(url, { data: order })
        .then((res) => {
          this.getCarts();
          this.status.cartQtyLoading = "";
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.status}`,
            text: err.data.message,
            confirmButtonText: "OK",
          });
        });
    },
    removeCart(id) {
      const url = `${baseUrl}/api/${path}/cart${id === '' ? 's' : "/" }${id} `;
      this.status.delCartLoading = id;
      axios
        .delete(url)
        .then((res) => {
          this.status.delCartLoading = "";
          this.getCarts();
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.status}`,
            text: err.data.message,
            confirmButtonText: "OK",
          });
        });
    },
    onSubmit(){
      this.isLoading = true;
      const url = `${baseUrl}/api/${path}/order`;
      const data = {
        "user": {
          "name": this.formParams.user.name,
          "email": this.formParams.user.email,
          "tel": this.formParams.user.tel,
          "address": this.formParams.user.address
        },
        "message": this.formParams.message
      }
      axios.post(url, { data })
        .then((res) => {
          // 送出訂單後，購物車需要清除原本項目
          this.getCarts();
          // reset the form and the field values to their initial values
          this.$refs.form.resetForm();
          // message 並未受到 v-field 控管
          this.formParams.message = '';
          this.isLoading = false;
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: `錯誤 ${err.status}`,
            text: err.data.message,
            confirmButtonText: "OK",
          });
        });
    },
    openModal(product) {
      this.selectProduct = product;
      // $refs: 是針對子元件操控其內部的方法
      this.$refs.productModal.open();
    },
    closeModal() {
      this.selectProduct = {};
      this.$refs.productModal.close();
    },
  },
  components: {
    productModal,
  },
  mounted() {
    this.isLoading = true; // Component 註冊時，狀態用
    this.getProducts();
    this.getCarts();
  },
});
app.component('loading', VueLoading.Component);
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);
app.mount("#app");

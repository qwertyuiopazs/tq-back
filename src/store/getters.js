const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  bannerList: state => state.banner.bannerList,
  everyPageBanner: state => state.banner.everyPageBanner
};
export default getters;

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { fetchArticles } from "./features/article/articleThunks";
import { fetchLrs } from "./features/lr/lrThunks";
import { fetchPlaces } from "./features/place/placeThunks";
import { fetchCustomers } from "./features/customer/customerThunks";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import NetworkStatus from "./components/NetworkStatus";
import Sidebar from "./components/Sidebar";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Only load Navbar if not on login page
  const hideNavbarRoutes = ["/login"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  // Check if the required data is loaded
  const { isLoaded: articlesLoaded } = useSelector((state) => state.article);
  // const { isLoaded: lrLoaded } = useSelector(state => state.lr);
  const { isLoaded: placesLoaded } = useSelector((state) => state.place);
  // const { isLoaded: customerLoaded } = useSelector(state => state.customer);

  useEffect(() => {
    if (!articlesLoaded) dispatch(fetchArticles());
    // if (!lrLoaded) dispatch(fetchLrs());
    if (!placesLoaded) dispatch(fetchPlaces());
    // if (!customerLoaded) dispatch(fetchCustomers());
  }, [articlesLoaded, placesLoaded, dispatch]);

  return (
    <div className="d-flex">

    {!shouldHideNavbar && <Sidebar />}

    <div className="main-content">
      <NetworkStatus />
      <AppRoutes />
    </div>

  </div>
  );
};

export default App;

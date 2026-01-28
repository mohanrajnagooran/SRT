import { configureStore } from '@reduxjs/toolkit';
import customerReducer from '../features/customer/customerSlice';
import placeReducer from '../features/place/placeSlice';
import articleReducer from '../features/article/articleSlice';
import lrReducer from '../features/lr/lrSlice';
import authReducer from '../pages/loginPage/authSlice';
import routePrefixReducer from '../features/RoutePrefix/routePrefixSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    customer: customerReducer,
    place: placeReducer,
    article: articleReducer,
    lr: lrReducer,
    routePrefix: routePrefixReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disable the check
    }),
});

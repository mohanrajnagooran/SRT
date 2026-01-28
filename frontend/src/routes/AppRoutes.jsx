import { Routes, Route } from "react-router-dom";
import CustomerList from "../features/customer/CustomerList";
import CustomerForm from "../features/customer/CustomerForm";
import HomePage from "../pages/HomePage";
import PlaceList from "../features/place/PlaceList";
import PlaceForm from "../features/place/PlaceForm";
import ArticleList from "../features/article/ArticleList";
import ArticleForm from "../features/article/ArticleForm";
import LrList from "../features/lr/LrList";
import LrForm from "../features/lr/LrForm";
import LrReport from "../features/lr/LrReport";
import MiscExpense from "../features/miscExpences/MiscExpense";
import UserManagement from "../features/UserManagement/UserManagement";
import CustomerWiseArticle from "../features/article/CustomerWiseArticle";
import CancelLR from "../features/lr/CancelLR";
import DeliverLR from "../features/lr/DeliverLR";
import TravelCreate from "../features/travel/TravelCreate";
import Travel from "../features/travel/Travel";
import TravelAssign from "../features/travel/TravelAssign";
import TravelUnpaidLR from "../features/travel/TravelUnpaidLR";
import TravelExpenses from "../features/travel/TravelExpenses";
import PlacePriority from "../features/place/PlacePriority";
import TravelDriver from "../features/driver/TravelDriver";
import TravelVehicle from "../features/vehicle/TravelVehicle";
import UptoPlace from "../features/place/UptoPlace";
import LoginPage from "../pages/loginPage/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import AccountsManagement from "../pages/AccountsManagement";
import AddTransaction from "../features/miscExpences/AddTransaction";
import RoutePrefixForm from "../features/RoutePrefix/RoutePrefixForm";
import RoutePrefixList from "../features/RoutePrefix/RoutePrefixList";
import RoutePrefixView from "../features/RoutePrefix/RoutePrefixView";





const AppRoutes = () => (
  <Routes>
    {/* public route */}
    <Route path="/login" element={<LoginPage />} />
    
    {/* protected route */}

    <Route path="/" element={
      <ProtectedRoute>
        <HomePage />
        </ProtectedRoute>} />

    {/* customer routes */}
    <Route path="/customers" element={
      <ProtectedRoute>
      <CustomerList />
      </ProtectedRoute>} />
    <Route path="/customers/add" element={
      <ProtectedRoute>
      <CustomerForm />
      </ProtectedRoute>
      } />
    <Route path="/customers/edit/:id" element={
      <ProtectedRoute>
      <CustomerForm />
      </ProtectedRoute>
      } />
    
    {/* place routes */}
    <Route path="/places" element={
      <ProtectedRoute>
      <PlaceList />
      </ProtectedRoute>
      } />
    <Route path="/places/add" element={
      <ProtectedRoute>
      <PlaceForm />
      </ProtectedRoute>
      } />
    <Route path="/places/edit/:id" element={
      <ProtectedRoute>
      <PlaceForm />
      </ProtectedRoute>
      } />
    <Route path="/places/placepriority" element={
      <ProtectedRoute>
      <PlacePriority />
      </ProtectedRoute>
      } />
    <Route path="/places/uptoplaces" element={
      <ProtectedRoute>
        <UptoPlace />
      </ProtectedRoute>
      } />

    {/* article routes */}
    <Route path="/articles" element={
      <ProtectedRoute>
        <ArticleList />
      </ProtectedRoute>
      } />
    <Route path="/articles/add" element={
      <ProtectedRoute>
        <ArticleForm />
      </ProtectedRoute>
      } />
    <Route path="/articles/edit/:id" element={
      <ProtectedRoute>
        <ArticleForm />
      </ProtectedRoute>
      } />
    <Route path="/articles/customerwise" element={
      <ProtectedRoute>
        <CustomerWiseArticle />
      </ProtectedRoute>
      } />

    {/* LR routes */}
    <Route path="/lrs" element={
      <ProtectedRoute>
        <LrList />
      </ProtectedRoute>
      } />
    <Route path="/lrs/add" element={
      <ProtectedRoute>
        <LrForm />
      </ProtectedRoute>
      } />
    <Route path="/lrs/edit/:id" element={
      <ProtectedRoute>
        <LrForm />
      </ProtectedRoute>
      } />
    <Route path="/lrs/report" element={
      <ProtectedRoute>
        <LrReport />
      </ProtectedRoute>
      } />
    <Route path="/lrs/cancellr" element={
      <ProtectedRoute>
        <CancelLR />
      </ProtectedRoute>
      } />
    <Route path="/lrs/deliverlr" element={
      <ProtectedRoute>
        <DeliverLR />
      </ProtectedRoute>
      } />
    

    {/* misc expenses */}
      <Route path="/expenses/misc" element={
        <ProtectedRoute>
            {/* <MiscExpense /> */}
            <AccountsManagement />
        </ProtectedRoute>
        } />
      <Route path="/add-transaction" element={
        <ProtectedRoute>
            <AddTransaction />
        </ProtectedRoute>
        } />

      {/* user management */}
      <Route path="/usermanagement" element={
        <ProtectedRoute>
        <UserManagement />
        </ProtectedRoute>
        } />

      {/* travel routes */}
      <Route path="/travel" element={
        <ProtectedRoute>
        <Travel />
        </ProtectedRoute>
        } />
      <Route path="/travel/create" element={
        <ProtectedRoute>
        <TravelCreate />
        </ProtectedRoute>
        } />
      <Route path="/travel/assign" element={
        <ProtectedRoute>
        <TravelAssign />
        </ProtectedRoute>
        } />
      <Route path="/travel/unpaidlr" element={
        <ProtectedRoute>
          <TravelUnpaidLR />
        </ProtectedRoute>
        } />
      <Route path="/travel/travelexpenses" element={
        <ProtectedRoute>
        <TravelExpenses />
        </ProtectedRoute>
        } />

      {/* drivr routes */}
      <Route path="/driver" element={
        <ProtectedRoute>
        <TravelDriver />
        </ProtectedRoute>
        } />

      {/* vehicle routes */}
      <Route path="/vehicle" element={
        <ProtectedRoute>
        <TravelVehicle />
        </ProtectedRoute>
        } />
      {/* routeprefix routes */}
      <Route path="/routeprefix/create" element={
        <ProtectedRoute>
        <RoutePrefixForm />
        </ProtectedRoute>
        } />
      <Route path="/routeprefix/edit/:id" element={
        <ProtectedRoute>
        <RoutePrefixForm />
        </ProtectedRoute>
        } />
      <Route path="/routeprefix" element={
        <ProtectedRoute>
        <RoutePrefixList />
        </ProtectedRoute>
        } />
      <Route path="/routeprefix/view/:id" element={
        <ProtectedRoute>
        <RoutePrefixView />
        </ProtectedRoute>
        } />


  </Routes>
);

export default AppRoutes;

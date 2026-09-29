import { Route, Switch } from "wouter";
import AdminDashboard from "./pages/AdminDashboard";
import AssetLibrary from "./pages/AssetLibrary";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/assets" component={AssetLibrary} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route component={Home} />
    </Switch>
  );
}

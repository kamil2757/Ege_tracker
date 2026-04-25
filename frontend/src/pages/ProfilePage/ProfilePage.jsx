import styles from "./ProfilePage.module.scss";
import HeaderProfile from "./sections/HeaderProfile/HeaderProfile";
import UserWishes from "./sections/UserWishes/UserWishes";
import MiniAnalytics from "./sections/MiniAnalytics/MiniAnalytics";

export default function ProfilePage() {
  return (
    <div className={"container " + styles.ProfilePage}>
      <HeaderProfile />
      {/* <UserWishes /> */}
      {/* <MiniAnalytics /> */}
    </div>
  );
}

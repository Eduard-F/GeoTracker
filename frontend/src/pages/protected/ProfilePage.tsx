import { useAppSelector } from "../../store/hooks";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.user.user);

  return (
    <div className="container">
      <p>Check the github repository:</p>
      <a href="https://github.com/flaviuse/mern-authentification">
        https://github.com/flaviuse/mern-authentification
      </a>
    </div>
  );
}

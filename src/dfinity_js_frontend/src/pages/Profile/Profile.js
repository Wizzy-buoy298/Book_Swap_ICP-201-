import React, { useEffect, useState, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "../../utils/auth";
import { Notification } from "../../components/utils/Notifications";
import BookList from "../../components/BookManagement/ListAvailableBooks";
import UserProfile1 from "../../components/UserManager/UserProfile";
import CreateUserProfile from "../../components/UserManager/CreateUserProfile";
import { getUserProfileByOwner } from "../../utils/BookSwap";
import Login from "./Login";
import Loader from "../../components/utils/Loader";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const isAuthenticated = window.auth.isAuthenticated;

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUserProfileByOwner();
      const userProfile = response.Ok; 
      console.log("User Profile Fetched:", userProfile); 
      setUser(userProfile);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <>
      <Notification />
      {isAuthenticated ? (
        !loading ? (
          user?.name ? (
            <>
              <main>
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
                <Container className="my-4">
                  <Row>
                    <Col>
                      <UserProfile1 user={user} />
                    </Col>
                  </Row>
                  <h1 className="text-primary font-weight-bold mb-4">
                    Books Collection
                  </h1>
                  <Row>
                    <Col>
                      <BookList user={user}/>
                    </Col>
                  </Row>
                </Container>
              </main>
            </>
          ) : (
            <CreateUserProfile fetchUserProfile={fetchUserProfile} />
          )
        ) : (
          <Loader />
        )
      ) : (
        <Login login={login} />
      )}
    </>
  );
};

export default UserProfile;

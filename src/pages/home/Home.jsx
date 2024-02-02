import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import "./home.css";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Header />
      <div className="homeContainer">
        <h1 className="homeTitle">Offers</h1>
        <div className="homeCards">
          <div className="card">
            <div className="card-body">
              <div className={"cardRow"}>
                <h5 className="card-title font-weight-bold">
                  <b>Take your longest vacation yet</b>
                </h5>
                <p className="card-text">
                  Browse properties offering long-term stays, many at reduced
                  monthly rates.
                </p>
                <span
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "#0071c2",
                  }}
                >
                  Find a stay
                </span>
              </div>
              <img src="/img/homecard1.jpeg" alt="" />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className={"cardRow"}>
                <h5 className="card-title font-weight-bold">
                  <b>Fly away to your dream vacation</b>
                </h5>
                <p className="card-text">
                  Get inspired – compare and book flights with flexibility
                </p>
                <span
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "#0071c2",
                  }}
                >
                  Search for flights
                </span>
              </div>

              <img src="/img/homecard2.png" alt="" />
            </div>
          </div>
        </div>
        <h1 className="homeTitle">Browse by property type</h1>
        <PropertyList />
        <h1 className="homeTitle">Popular cities</h1>
        <Featured />
        <h1 className="homeTitle">Homes guests love</h1>
        <FeaturedProperties />
        <Footer />
      </div>
    </div>
  );
};

export default Home;

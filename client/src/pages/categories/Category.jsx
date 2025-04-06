import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import CategoryTable from "./components/CategoryTable";

const CategoryPage = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto pt-16 px-4 py-8">
        <CategoryTable />
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;

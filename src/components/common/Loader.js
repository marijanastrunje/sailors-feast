const Loader = ({ message = "Loading section..." }) => (
    <div className="container my-4 py-4 bg-light text-center rounded">
      <div className="spinner-border text-prim" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
    </div>
  );
  
  export default Loader;
  
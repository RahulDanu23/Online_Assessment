function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted");
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center mb-6">Login</h1>
      <div className="flex flex-col items-center border-2 rounded-xl w-full max-w-md mx-auto p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <input
            className="m-2 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter e-mail"
          />
          <input
            className="m-2 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Enter password"
          />
          <button
            type="submit"
            className="m-3 p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
          >
            Login
          </button>
          <p className="m-3 text-center">
            Don't have an account?{" "}
            <button type="button" className="text-blue-700 hover:underline">
              Register
            </button>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;

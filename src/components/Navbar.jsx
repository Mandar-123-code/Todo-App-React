const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-600 text-white py-3 px-6 shadow-lg rounded-b-xl">
      <div className="logo flex items-center gap-2">
        <span className="font-extrabold text-2xl tracking-wider uppercase drop-shadow-md">
          iTask
        </span>
        <span className="text-sm text-gray-200 italic drop-shadow-sm">
          Manage your todos
        </span>
      </div>
    </nav>
  );
};

export default Navbar;

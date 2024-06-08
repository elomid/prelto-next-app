const NoSideBarLayout = ({ children }) => {
  return (
    <div>
      <main className="px-16 pl-32 mx-auto max-w-[1400px] py-8">
        {children}
      </main>
    </div>
  );
};

export default NoSideBarLayout;

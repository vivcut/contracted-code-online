<nav
  className={`fixed top-0 z-[30] left-0 right-0 justify-between w-screen items-center transition-all duration-300 not-sm:!px-2`}
  style={{
    background: "rgba(255,255,255,0.7)",
    WebkitBackdropFilter: "blur(18px)",
    backdropFilter: "blur(18px)",
    boxShadow: isScrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
    borderBottom: "1px solid rgba(0,0,0,0.04)",
    // Remove overflow: hidden here
  }}
>
  <div
    className={`flex items-center w-full space-x-3 justify-between py-4 px-6 pl-6 transition duration-200 ease-in-out relative`}
    style={{ minHeight: 64 }}
  >
    {/* Feathered blur overlay */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[-1]"
      style={{
        background: "linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%)",
        WebkitBackdropFilter: "blur(18px)",
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight - 24;
      setIsScrolled(y > 1); // keep old behavior
      setIsDeepScrolled(y > vh); // new additional threshold
    };

    handleScroll(); // initialize on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-[30] left-0 right-0 justify-between w-screen items-center transition-all duration-300 not-sm:!px-2 ${isScrolled && ""
      }`}
    >
      <div
      className={`flex items-center w-full space-x-3 justify-between py-4 px-6 pl-6 transition duration-200 ease-in-out relative overflow-hidden`}
      style={{ minHeight: 64 }}
      >
      {/* Feathered blur overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[-1]"
        style={{
        // Top: strong blur, bottom: transparent
        background: "linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%)",
        WebkitBackdropFilter: "blur(18px)",
        backdropFilter: "blur(18px)",
        maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      />
      <div className="flex items-center space-x-6">
        <Link href={"/"}>
        <div className="flex cursor-pointer text-white items-center space-x-[3px] select-none">
          <CircleHalf
          weight="regular"
          className={`size-6 mix-blend-difference text-black`}
          />
          <h1
          className={`text-[24px] text-black font-[400] -translate-y-[1px] tracking-tight transition-opacity duration-200 ease-in-out ${isScrolled && "opacty-0"
            }`}
          >
          Contracted
          </h1>
        </div>
        </Link>
        <div className="flex items-center space-x-2 ml-4">
        <Button variant={"ghost"}>
          Features
        </Button>
        <Button variant={"ghost"}>
          Deposits
        </Button>
        <Button variant={"ghost"}>
          Donate
        </Button>
        </div>
      </div>
      <section className="flex -translate-x-10 items-center space-x-3 not-lg:sr-only">
        {/* Add nav items here if needed */}
      </section>
      <LoginWrapper>
        <Button className="w-[150px]" variant={"default"}>{user ? "Dashboard" : "Sign Up"}</Button>
      </LoginWrapper>
      </div>
    </nav>
  );
}
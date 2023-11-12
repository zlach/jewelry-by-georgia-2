function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto box-border max-w-[1140px] px-0 md:px-20">
      {children}
    </div>
  );
}

export default Container;

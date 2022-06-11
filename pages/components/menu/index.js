export const Menu = ({
  type,
  size,
  onSelectSize,
  onSelectType,
  onNewGame,
  onJoinGame,
}) => {
  const onGridSizeChange = (ev) => {
    onSelectSize(ev.target.value);
  };

  const onGridTypeChange = (ev) => {
    onSelectType(ev.target.value);
  };

  return (
    <header className="p-3">
      <div className="flex justify-center items-center">
        <h1 className="text-2xl w-4/12">
          <a href="/">memory</a>
        </h1>
        <div className="flex justify-end w-8/12">
          <button
            onClick={onNewGame}
            className="p-2 md:p-3 mx-2 bg-yellow-500 text-white bold rounded-lg"
          >
            New Game
          </button>

          <button
            className={`p-2 md:p-3 mx-2 bg-gray-300
             text-white bold rounded-lg`}
            onClick={onJoinGame}
          >
            Join Game
          </button>
        </div>
      </div>
      <div className="flex justify-around align-items-center pt-12 pb-6 switch-field">
        <div>
          <input
            type="radio"
            id="numbers"
            name="mode"
            value="NUM"
            checked={type === "NUM"}
            onChange={onGridTypeChange}
          />
          <label htmlFor="numbers">Numbers</label>
          <input
            type="radio"
            id="symbols"
            name="mode"
            value="SYM"
            checked={type === "SYM"}
            onChange={onGridTypeChange}
          />
          <label htmlFor="symbols">Symbols</label>
        </div>
        <div className="ml-2">
          <input
            type="radio"
            id="four"
            name="grid"
            value="8"
            checked={size === 8}
            onChange={onGridSizeChange}
          />
          <label htmlFor="four">4x4</label>
          <input
            type="radio"
            id="six"
            name="grid"
            value="18"
            checked={size === 18}
            onChange={onGridSizeChange}
          />
          <label htmlFor="six">6x6</label>
        </div>
      </div>
    </header>
  );
};

export default Menu;

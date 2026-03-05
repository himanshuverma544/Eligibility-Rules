import Icon from "./utils/Icon";


export default function FilterItem({
  selectedSearchItem = "",
  handleSelectedFilterItem = null
}) {

  if (!selectedSearchItem || !handleSelectedFilterItem) {
    return null;
  }

  return (
    <div className="filter-item flex justify-center items-center gap-2 px-2 py-0.5 rounded-lg bg-black/10">
      <span className="filter-name text-sm">
        {selectedSearchItem}
      </span>
      <button
        className="remove-filter-item-btn cursor-pointer"
        onClick={() => handleSelectedFilterItem(selectedSearchItem)}
      >
        <Icon
          className="cross-icon relative size-[0.5rem]"
          innerClassName="absolute inset-0 size-full"
          icon="/icons/cross.svg"
          alt="cross-icon"
        />
      </button>
    </div>
  );
}

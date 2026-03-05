import FilterItem from "./FilterItem";


export default function SearchSelectorFilter({
  className = "",
  selectedSearchItems = [],
  handleSelectedSearchItems = null
}) {
    
  if (selectedSearchItems.length <= 0 || !handleSelectedSearchItems) {
    return null;
  }

  return (
    <div className={`search-selector-filter flex flex-wrap items-center gap-x-5 gap-y-2 mt-2 ${className}`}>
      {selectedSearchItems.map((selectedSearchItem, index) =>
        <FilterItem
          key={index}
          selectedSearchItem={selectedSearchItem}
          handleSelectedFilterItem={handleSelectedSearchItems}
        />
      )}
    </div>
  );
}
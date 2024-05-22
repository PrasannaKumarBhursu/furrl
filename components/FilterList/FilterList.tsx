import React from "react";
import Styles from "../../styles/page.module.css"

const FilterList = ({ filters, selectedFilter, onFilterClick }: any) => {
    return (
        <div className={Styles.filterContainer}>
            <div className={Styles.filterList}>
                {filters.map((filter: any) => (
                    <p
                        key={filter.uniqueId}
                        className={`${Styles.filterItem} ${selectedFilter === filter.uniqueId ? Styles.active : ""}`}
                        onClick={() => onFilterClick(filter.uniqueId)}
                    >
                        {filter.name}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default FilterList;

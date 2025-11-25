import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { ChevronDown } from "lucide-react";

function ProductFilter({ filters, handleFilter, categories }) {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Transform categories into filterOptions format with defensive checks
  const filterOptions = Array.isArray(categories)
    ? categories.reduce((acc, category) => {
        // Ensure category has a name and subcategories is an array
        if (category && typeof category.name === "string" && Array.isArray(category.subcategories)) {
          acc[category.name] = category.subcategories.map((subcat) => ({
            id: subcat.id,
            label: subcat.name,
          }));
        }
        return acc;
      }, {})
    : {};

  return (
    <div className="space-y-6">
      {Object.keys(filterOptions).length > 0 ? (
        Object.keys(filterOptions).map((keyItem) => (
          <div key={keyItem} className="space-y-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection(keyItem)}
            >
              <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
                {keyItem}
              </h3>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  expandedSections[keyItem] ? "rotate-180" : ""
                }`}
              />
            </div>

            <AnimatePresence>
              {expandedSections[keyItem] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-2 mt-2 pl-1">
                    {filterOptions[keyItem].map((option) => (
                      <Label
                        key={option.id}
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <Checkbox
                          id={`${keyItem}-${option.id}`}
                          checked={
                            filters &&
                            Object.keys(filters).length > 0 &&
                            filters[keyItem] &&
                            filters[keyItem].includes(option.id)
                          }
                          onCheckedChange={() => handleFilter(keyItem, option.id)}
                          className="data-[state=checked]:bg-[#E6C692] data-[state=checked]:text-black border-gray-400"
                        />
                        {option.label}
                      </Label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <Separator className="my-3" />
          </div>
        ))
      ) : (
        <p className="text-gray-500">No categories available.</p>
      )}
    </div>
  );
}

export default ProductFilter;
import { useState, useEffect, useMemo, useCallback } from "react";
import type { DropdownOption, UseDropdownParams } from "./Dropdown.types";

/**
 * useDropdown
 * Encapsulates all state and logic for the Dropdown component.
 * Keeps the component file clean and the logic testable in isolation.
 */
export function useDropdown({
    options,
    value,
    onChange,
    multiSelect,
    autoSelect,
    noAutoSelect,
}: UseDropdownParams) {
    // ── Open/close state ────────────────────────────────────────────────────────
    const [isOpen, setIsOpen] = useState(false);

    // ── Search query ────────────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");

    // ── Keyboard cursor index inside filtered list ──────────────────────────────
    const [activeIndex, setActiveIndex] = useState(0);

    // ── Internal selected values (uncontrolled fallback) ───────────────────────
    const [internalSelected, setInternalSelected] = useState<string[]>(() => {
        if (value === undefined) return [];
        return Array.isArray(value) ? value : [value];
    });

    // The "real" selected values — controlled wins over internal
    const selectedValues: string[] = useMemo(() => {
        if (value !== undefined) {
            return Array.isArray(value) ? value : value ? [value] : [];
        }
        return internalSelected;
    }, [value, internalSelected]);

    // ── Auto-select first option on mount ──────────────────────────────────────
    useEffect(() => {
        if (
            autoSelect &&
            !noAutoSelect &&
            options.length > 0 &&
            selectedValues.length === 0
        ) {
            const first = options[0];
            setInternalSelected([first.value]);
            onChange?.(multiSelect ? [first.value] : first.value);
        }
        // Run only once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Filtered options based on search ───────────────────────────────────────
    const filteredOptions = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return options;
        return options.filter((o) => o.label.toLowerCase().includes(q));
    }, [options, searchQuery]);

    // Reset active index when filtered list changes
    useEffect(() => {
        setActiveIndex(0);
    }, [filteredOptions]);

    // ── Helper: is a given value currently selected? ────────────────────────────
    const isSelected = useCallback(
        (val: string) => selectedValues.includes(val),
        [selectedValues]
    );

    // ── Handle selecting / deselecting an option ────────────────────────────────
    const handleSelect = useCallback(
        (option: DropdownOption) => {
            let next: string[];

            if (multiSelect) {
                // Toggle the clicked option
                next = isSelected(option.value)
                    ? selectedValues.filter((v) => v !== option.value)
                    : [...selectedValues, option.value];
            } else {
                // Single select — close after choosing
                next = [option.value];
                setIsOpen(false);
                setSearchQuery("");
            }

            setInternalSelected(next);
            onChange?.(multiSelect ? next : next[0] ?? "");
        },
        [multiSelect, isSelected, selectedValues, onChange]
    );

    // ── Clear all selections ────────────────────────────────────────────────────
    const handleClearAll = useCallback(() => {
        setInternalSelected([]);
        onChange?.(multiSelect ? [] : "");
    }, [multiSelect, onChange]);

    // ── Select / deselect all (multi only) ─────────────────────────────────────
    const allSelected =
        filteredOptions.length > 0 &&
        filteredOptions.every((o) => isSelected(o.value));

    const handleSelectAll = useCallback(() => {
        let next: string[];

        if (allSelected) {
            // Deselect all filtered options but keep others that might be selected
            const filteredVals = new Set(filteredOptions.map((o) => o.value));
            next = selectedValues.filter((v) => !filteredVals.has(v));
        } else {
            // Add all filtered options to selection
            const filteredVals = filteredOptions.map((o) => o.value);
            next = Array.from(new Set([...selectedValues, ...filteredVals]));
        }

        setInternalSelected(next);
        onChange?.(next);
    }, [allSelected, filteredOptions, selectedValues, onChange]);

    return {
        isOpen,
        searchQuery,
        filteredOptions,
        activeIndex,
        selectedValues,
        setIsOpen,
        setSearchQuery,
        setActiveIndex,
        handleSelect,
        handleClearAll,
        handleSelectAll,
        isSelected,
        allSelected,
    };
}

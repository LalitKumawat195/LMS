import React, { useState } from 'react';
import {
  Stack,
  SearchBox,
  Dropdown,
  DefaultButton,
  Panel,
  PanelType,
  Text,
  Checkbox,
  Slider,
  DatePicker
} from '@fluentui/react';

const AdvancedSearch = ({ onSearch, books = [] }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    availability: 'all',
    yearRange: [1900, new Date().getFullYear()],
    author: '',
    publisher: '',
    location: '',
    dateAdded: null
  });

  const categoryOptions = [
    { key: '', text: 'All Categories' },
    { key: 'Fiction', text: 'Fiction' },
    { key: 'Non-Fiction', text: 'Non-Fiction' },
    { key: 'Science', text: 'Science' },
    { key: 'Technology', text: 'Technology' },
    { key: 'History', text: 'History' },
    { key: 'Biography', text: 'Biography' },
    { key: 'Reference', text: 'Reference' }
  ];

  const availabilityOptions = [
    { key: 'all', text: 'All Books' },
    { key: 'available', text: 'Available Only' },
    { key: 'issued', text: 'Currently Issued' },
    { key: 'unavailable', text: 'Unavailable' }
  ];

  const applyFilters = () => {
    let filteredBooks = books.filter(book => {
      // Text search
      const matchesSearch = !searchQuery || 
        book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn?.includes(searchQuery);

      // Category filter
      const matchesCategory = !filters.category || book.category === filters.category;

      // Availability filter
      let matchesAvailability = true;
      if (filters.availability === 'available') {
        matchesAvailability = book.available > 0;
      } else if (filters.availability === 'issued') {
        matchesAvailability = book.issued > 0;
      } else if (filters.availability === 'unavailable') {
        matchesAvailability = book.available === 0;
      }

      // Year filter
      const bookYear = parseInt(book.year) || 0;
      const matchesYear = bookYear >= filters.yearRange[0] && bookYear <= filters.yearRange[1];

      // Author filter
      const matchesAuthor = !filters.author || 
        book.author?.toLowerCase().includes(filters.author.toLowerCase());

      // Publisher filter
      const matchesPublisher = !filters.publisher || 
        book.publisher?.toLowerCase().includes(filters.publisher.toLowerCase());

      // Location filter
      const matchesLocation = !filters.location || 
        book.location?.toLowerCase().includes(filters.location.toLowerCase());

      return matchesSearch && matchesCategory && matchesAvailability && 
             matchesYear && matchesAuthor && matchesPublisher && matchesLocation;
    });

    onSearch(filteredBooks, searchQuery);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      category: '',
      availability: 'all',
      yearRange: [1900, new Date().getFullYear()],
      author: '',
      publisher: '',
      location: '',
      dateAdded: null
    });
    onSearch(books, '');
  };

  return (
    <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="end">
      <SearchBox
        placeholder="Search books by title, author, or ISBN..."
        value={searchQuery}
        onChange={(_, value) => setSearchQuery(value || '')}
        onSearch={applyFilters}
        styles={{ root: { minWidth: 300 } }}
      />
      
      <DefaultButton
        text="Advanced Filters"
        iconProps={{ iconName: 'Filter' }}
        onClick={() => setShowFilters(true)}
      />
      
      <DefaultButton
        text="Search"
        iconProps={{ iconName: 'Search' }}
        onClick={applyFilters}
      />

      <Panel
        isOpen={showFilters}
        onDismiss={() => setShowFilters(false)}
        type={PanelType.medium}
        headerText="Advanced Search Filters"
      >
        <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20 } }}>
          <Dropdown
            label="Category"
            options={categoryOptions}
            selectedKey={filters.category}
            onChange={(_, option) => setFilters({ ...filters, category: option?.key || '' })}
          />

          <Dropdown
            label="Availability"
            options={availabilityOptions}
            selectedKey={filters.availability}
            onChange={(_, option) => setFilters({ ...filters, availability: option?.key || 'all' })}
          />

          <Stack>
            <Text>Publication Year Range</Text>
            <Slider
              min={1900}
              max={new Date().getFullYear()}
              step={1}
              defaultValue={filters.yearRange[0]}
              onChange={(value) => setFilters({ ...filters, yearRange: [value, filters.yearRange[1]] })}
              showValue
            />
            <Slider
              min={1900}
              max={new Date().getFullYear()}
              step={1}
              defaultValue={filters.yearRange[1]}
              onChange={(value) => setFilters({ ...filters, yearRange: [filters.yearRange[0], value] })}
              showValue
            />
          </Stack>

          <SearchBox
            label="Author"
            placeholder="Filter by author..."
            value={filters.author}
            onChange={(_, value) => setFilters({ ...filters, author: value || '' })}
          />

          <SearchBox
            label="Publisher"
            placeholder="Filter by publisher..."
            value={filters.publisher}
            onChange={(_, value) => setFilters({ ...filters, publisher: value || '' })}
          />

          <SearchBox
            label="Location"
            placeholder="Filter by location..."
            value={filters.location}
            onChange={(_, value) => setFilters({ ...filters, location: value || '' })}
          />

          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <DefaultButton
              text="Apply Filters"
              iconProps={{ iconName: 'CheckMark' }}
              onClick={applyFilters}
            />
            <DefaultButton
              text="Clear All"
              iconProps={{ iconName: 'Clear' }}
              onClick={clearFilters}
            />
          </Stack>
        </Stack>
      </Panel>
    </Stack>
  );
};

export default AdvancedSearch;
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Dropdown from '../Dropdown/Dropdown.vue'
import { nextTick } from 'vue'

describe('Dropdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const defaultProps = {
    options: [
      { label: 'Option 1', value: 1 },
      { label: 'Option 2', value: 2 },
      { label: 'Option 3', value: 3 }
    ],
    modelValue: null
  }

  describe('rendering', () => {
    it('renders with default width of 100%', () => {
      const wrapper = mount(Dropdown, { props: defaultProps })
      const container = wrapper.find('.dropdown-container')
      
      expect(container.attributes('style')).toContain('width: 100%')
    })

    it('renders with custom width when provided', () => {
      const wrapper = mount(Dropdown, {
        props: { ...defaultProps, width: '300px' }
      })
      const container = wrapper.find('.dropdown-container')
      
      expect(container.attributes('style')).toContain('width: 300px')
    })

    it('renders collapsed by default', () => {
      const wrapper = mount(Dropdown, { props: defaultProps })
      const expanded = wrapper.find('.dropdown-expanded')
      
      expect(expanded.isVisible()).toBe(false)
    })

    it('displays modelValue label when provided', () => {
      const wrapper = mount(Dropdown, {
        props: {
          ...defaultProps,
          modelValue: { label: 'Selected Option', value: 42 }
        }
      })
      const dropdown = wrapper.find('.dropdown')
      
      expect(dropdown.text()).toContain('Selected Option')
    })
  })

  describe('expansion toggle', () => {
    it('expands when clicked', async () => {
      const wrapper = mount(Dropdown, { props: defaultProps })
      const dropdownTrigger = wrapper.find('.dropdown')
      
      await dropdownTrigger.trigger('click')
      await nextTick()
      
      const expanded = wrapper.find('.dropdown-expanded')
      expect(expanded.isVisible()).toBe(true)
    })

    it('collapses when clicked twice', async () => {
      const wrapper = mount(Dropdown, { props: defaultProps })
      const dropdownTrigger = wrapper.find('.dropdown')
      
      await dropdownTrigger.trigger('click')
      await nextTick()
      await dropdownTrigger.trigger('click')
      await nextTick()
      
      const expanded = wrapper.find('.dropdown-expanded')
      expect(expanded.isVisible()).toBe(false)
    })
  })

  describe('options rendering', () => {
    it('renders all options when expanded', async () => {
      const wrapper = mount(Dropdown, { props: defaultProps })
      
      await wrapper.find('.dropdown').trigger('click')
      await nextTick()
      
      const options = wrapper.findAll('.option')
      expect(options).toHaveLength(3)
      expect(options[0]!.text()).toBe('Option 1')
      expect(options[1]!.text()).toBe('Option 2')
      expect(options[2]!.text()).toBe('Option 3')
    })

    it('renders search input when expanded', async () => {
      const wrapper = mount(Dropdown, { props: defaultProps })
      
      await wrapper.find('.dropdown').trigger('click')
      await nextTick()
      
      const searchInput = wrapper.find('input[type="text"]')
      expect(searchInput.exists()).toBe(true)
      expect(searchInput.attributes('placeholder')).toBe('Search...')
    })
  })

  describe('width prop behavior', () => {
    it('applies width to both container and expanded dropdown', async () => {
      const wrapper = mount(Dropdown, {
        props: { ...defaultProps, width: '500px' }
      })
      
      await wrapper.find('.dropdown').trigger('click')
      await nextTick()
      
      const container = wrapper.find('.dropdown-container')
      const expanded = wrapper.find('.dropdown-expanded')
      
      expect(container.attributes('style')).toContain('width: 500px')
      expect(expanded.attributes('style')).toContain('width: 500px')
    })
  })

  describe('selection', () => {
    it('emits selected event with full option object when item is clicked', async () => {
      const wrapper = mount(Dropdown, { props: defaultProps })
      
      await wrapper.find('.dropdown').trigger('click')
      await nextTick()
      
      const firstOption = wrapper.findAll('.option')[0]!
      await firstOption.trigger('click')
      
      expect(wrapper.emitted('selected')).toBeTruthy()
      expect(wrapper.emitted('selected')![0]).toEqual([{ label: 'Option 1', value: 1 }])
    })

    it('closes dropdown after selection', async () => {
      const wrapper = mount(Dropdown, { props: defaultProps })
      
      await wrapper.find('.dropdown').trigger('click')
      await nextTick()
      
      const firstOption = wrapper.findAll('.option')[0]!
      await firstOption.trigger('click')
      await nextTick()
      
      const expanded = wrapper.find('.dropdown-expanded')
      expect(expanded.isVisible()).toBe(false)
    })
  })

  describe('search functionality', () => {
    it('debounces search input with 300ms delay', async () => {
      const wrapper = mount(Dropdown, { props: defaultProps })
      
      await wrapper.find('.dropdown').trigger('click')
      await nextTick()
      
      const searchInput = wrapper.find('input[type="text"]')
      await searchInput.setValue('test')
      
      // Should not emit immediately
      expect(wrapper.emitted('search')).toBeFalsy()
      
      // Advance timers by 300ms
      vi.advanceTimersByTime(300)
      await nextTick()
      
      // Should emit after debounce delay
      expect(wrapper.emitted('search')).toBeTruthy()
      expect(wrapper.emitted('search')![0]).toEqual(['test'])
    })

    it('only emits search when query changes (distinct check)', async () => {
      const wrapper = mount(Dropdown, { props: defaultProps })
      
      await wrapper.find('.dropdown').trigger('click')
      await nextTick()
      
      const searchInput = wrapper.find('input[type="text"]')
      
      // First search
      await searchInput.setValue('test')
      vi.advanceTimersByTime(300)
      await nextTick()
      
      // Same search again
      await searchInput.setValue('test')
      vi.advanceTimersByTime(300)
      await nextTick()
      
      // Should only emit once because the query didn't change
      expect(wrapper.emitted('search')).toHaveLength(1)
    })

    it('emits search when query changes to different value', async () => {
      const wrapper = mount(Dropdown, { props: defaultProps })
      
      await wrapper.find('.dropdown').trigger('click')
      await nextTick()
      
      const searchInput = wrapper.find('input[type="text"]')
      
      // First search
      await searchInput.setValue('test')
      vi.advanceTimersByTime(300)
      await nextTick()
      
      // Different search
      await searchInput.setValue('another')
      vi.advanceTimersByTime(300)
      await nextTick()
      
      // Should emit twice because the query changed
      expect(wrapper.emitted('search')).toHaveLength(2)
      expect(wrapper.emitted('search')![0]).toEqual(['test'])
      expect(wrapper.emitted('search')![1]).toEqual(['another'])
    })

    it('clears previous debounce timeout when typing quickly', async () => {
      const wrapper = mount(Dropdown, { props: defaultProps })
      
      await wrapper.find('.dropdown').trigger('click')
      await nextTick()
      
      const searchInput = wrapper.find('input[type="text"]')
      
      // Type quickly
      await searchInput.setValue('t')
      vi.advanceTimersByTime(100)
      await searchInput.setValue('te')
      vi.advanceTimersByTime(100)
      await searchInput.setValue('tes')
      vi.advanceTimersByTime(100)
      await searchInput.setValue('test')
      vi.advanceTimersByTime(300)
      await nextTick()
      
      // Should only emit once with the final value
      expect(wrapper.emitted('search')).toHaveLength(1)
      expect(wrapper.emitted('search')![0]).toEqual(['test'])
    })

    it('clears search when dropdown is closed by clicking outside', async () => {
      const wrapper = mount(Dropdown, { props: defaultProps })
      
      await wrapper.find('.dropdown').trigger('click')
      await nextTick()
      
      const searchInput = wrapper.find('input[type="text"]')
      await searchInput.setValue('test')
      vi.advanceTimersByTime(300)
      await nextTick()
      
      // Click outside to close
      const clickEvent = new MouseEvent('click', { bubbles: true })
      document.dispatchEvent(clickEvent)
      await nextTick()
      
      // Should emit empty string to clear search
      expect(wrapper.emitted('search')).toBeTruthy()
      const emittedEvents = wrapper.emitted('search')!
      expect(emittedEvents[emittedEvents.length - 1]).toEqual([''])
    })
  })
})

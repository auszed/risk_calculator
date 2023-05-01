
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.58.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Calculator_comp.svelte generated by Svelte v3.58.0 */

    const file$1 = "src\\components\\Calculator_comp.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (82:4) {#each symbol_values as symbol}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*symbol*/ ctx[18].Symbol + "";
    	let t;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*symbol*/ ctx[18].Symbol;
    			option.value = option.__value;
    			option.selected = option_selected_value = /*symbol_val*/ ctx[3] === /*symbol*/ ctx[18].Symbol;
    			add_location(option, file$1, 82, 6, 2465);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*symbol_val*/ 8 && option_selected_value !== (option_selected_value = /*symbol_val*/ ctx[3] === /*symbol*/ ctx[18].Symbol)) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(82:4) {#each symbol_values as symbol}",
    		ctx
    	});

    	return block;
    }

    // (101:1) {#if contracts_loaded ||  stop_points_validation}
    function create_if_block_3(ctx) {
    	let p;
    	let t1;
    	let h1;
    	let t2_value = /*contracts_loaded*/ ctx[5] * /*stop_points_validation*/ ctx[4] * /*value_in_money*/ ctx[8] + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "total points in cash";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text(t2_value);
    			t3 = text(" $");
    			attr_dev(p, "class", "svelte-1hp0k0n");
    			add_location(p, file$1, 101, 1, 3175);
    			attr_dev(h1, "class", "svelte-1hp0k0n");
    			add_location(h1, file$1, 102, 1, 3205);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contracts_loaded, stop_points_validation, value_in_money*/ 304 && t2_value !== (t2_value = /*contracts_loaded*/ ctx[5] * /*stop_points_validation*/ ctx[4] * /*value_in_money*/ ctx[8] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(101:1) {#if contracts_loaded ||  stop_points_validation}",
    		ctx
    	});

    	return block;
    }

    // (108:1) {#if contracts_loaded ||  stop_points_validation}
    function create_if_block_2(ctx) {
    	let p;
    	let t1;
    	let h1;
    	let t2_value = /*contracts_loaded*/ ctx[5] * /*stop_points_validation*/ ctx[4] + "";
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "total poins";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text(t2_value);
    			attr_dev(p, "class", "svelte-1hp0k0n");
    			add_location(p, file$1, 108, 1, 3349);
    			attr_dev(h1, "class", "svelte-1hp0k0n");
    			add_location(h1, file$1, 109, 1, 3370);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contracts_loaded, stop_points_validation*/ 48 && t2_value !== (t2_value = /*contracts_loaded*/ ctx[5] * /*stop_points_validation*/ ctx[4] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(108:1) {#if contracts_loaded ||  stop_points_validation}",
    		ctx
    	});

    	return block;
    }

    // (117:1) {#if risk ||  value_in_money || stop_points_validation}
    function create_if_block_1(ctx) {
    	let p;
    	let t1;
    	let h1;
    	let t2_value = /*risk*/ ctx[1] / (/*value_in_money*/ ctx[8] * /*stop_points_validation*/ ctx[4]) + "";
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "contracts need from the risk";
    			t1 = space();
    			h1 = element("h1");
    			t2 = text(t2_value);
    			attr_dev(p, "class", "svelte-1hp0k0n");
    			add_location(p, file$1, 117, 1, 3674);
    			attr_dev(h1, "class", "svelte-1hp0k0n");
    			add_location(h1, file$1, 118, 1, 3712);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*risk, value_in_money, stop_points_validation*/ 274 && t2_value !== (t2_value = /*risk*/ ctx[1] / (/*value_in_money*/ ctx[8] * /*stop_points_validation*/ ctx[4]) + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(117:1) {#if risk ||  value_in_money || stop_points_validation}",
    		ctx
    	});

    	return block;
    }

    // (125:1) {#if risk_configuration ||  stop_points_validation}
    function create_if_block(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let h1;
    	let t4_value = /*risk_configuration*/ ctx[6] * /*stop_points_validation*/ ctx[4] + "";
    	let t4;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("risk ratio ");
    			t1 = text(/*risk_configuration*/ ctx[6]);
    			t2 = text(" : 1");
    			t3 = space();
    			h1 = element("h1");
    			t4 = text(t4_value);
    			attr_dev(p, "class", "svelte-1hp0k0n");
    			add_location(p, file$1, 125, 1, 3847);
    			attr_dev(h1, "class", "svelte-1hp0k0n");
    			add_location(h1, file$1, 126, 1, 3892);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*risk_configuration*/ 64) set_data_dev(t1, /*risk_configuration*/ ctx[6]);
    			if (dirty & /*risk_configuration, stop_points_validation*/ 80 && t4_value !== (t4_value = /*risk_configuration*/ ctx[6] * /*stop_points_validation*/ ctx[4] + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(125:1) {#if risk_configuration ||  stop_points_validation}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let div2;
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let br0;
    	let t3;
    	let div1;
    	let label1;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let input1;
    	let br1;
    	let t8;
    	let div3;
    	let label2;
    	let t10;
    	let select;
    	let t11;
    	let label3;
    	let t13;
    	let input2;
    	let t14;
    	let label4;
    	let t16;
    	let input3;
    	let t17;
    	let label5;
    	let t19;
    	let input4;
    	let t20;
    	let t21;
    	let t22;
    	let p;
    	let t24;
    	let h1;
    	let t25;
    	let t26;
    	let t27;
    	let t28;
    	let t29;
    	let h2;
    	let t30;
    	let t31;
    	let t32;
    	let button0;
    	let t34;
    	let button1;
    	let mounted;
    	let dispose;
    	let each_value = /*symbol_values*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block0 = (/*contracts_loaded*/ ctx[5] || /*stop_points_validation*/ ctx[4]) && create_if_block_3(ctx);
    	let if_block1 = (/*contracts_loaded*/ ctx[5] || /*stop_points_validation*/ ctx[4]) && create_if_block_2(ctx);
    	let if_block2 = (/*risk*/ ctx[1] || /*value_in_money*/ ctx[8] || /*stop_points_validation*/ ctx[4]) && create_if_block_1(ctx);
    	let if_block3 = (/*risk_configuration*/ ctx[6] || /*stop_points_validation*/ ctx[4]) && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "💶 Risk 💶:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			br0 = element("br");
    			t3 = space();
    			div1 = element("div");
    			label1 = element("label");
    			t4 = text("🎯Min target in R:");
    			t5 = text(/*risk_configuration*/ ctx[6]);
    			t6 = text("🎯");
    			t7 = space();
    			input1 = element("input");
    			br1 = element("br");
    			t8 = space();
    			div3 = element("div");
    			label2 = element("label");
    			label2.textContent = "🛒Symbol selection🛒";
    			t10 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t11 = space();
    			label3 = element("label");
    			label3.textContent = "🚫Stop in points🚫";
    			t13 = space();
    			input2 = element("input");
    			t14 = space();
    			label4 = element("label");
    			label4.textContent = "📜Contracts load📜";
    			t16 = space();
    			input3 = element("input");
    			t17 = space();
    			label5 = element("label");
    			label5.textContent = "📈Minimum risk📈";
    			t19 = space();
    			input4 = element("input");
    			t20 = space();
    			if (if_block0) if_block0.c();
    			t21 = space();
    			if (if_block1) if_block1.c();
    			t22 = space();
    			p = element("p");
    			p.textContent = "Price per point:";
    			t24 = space();
    			h1 = element("h1");
    			t25 = text(/*symbol_find_value*/ ctx[7]);
    			t26 = text(" $");
    			t27 = space();
    			if (if_block2) if_block2.c();
    			t28 = space();
    			if (if_block3) if_block3.c();
    			t29 = space();
    			h2 = element("h2");
    			t30 = text("current volume: ");
    			t31 = text(/*volume*/ ctx[0]);
    			t32 = space();
    			button0 = element("button");
    			button0.textContent = "increase volume";
    			t34 = space();
    			button1 = element("button");
    			button1.textContent = "decrease volume";
    			attr_dev(label0, "for", "risk");
    			attr_dev(label0, "class", "svelte-1hp0k0n");
    			add_location(label0, file$1, 64, 3, 1786);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "id", "risk");
    			attr_dev(input0, "name", "risk");
    			attr_dev(input0, "class", "svelte-1hp0k0n");
    			add_location(input0, file$1, 65, 3, 1829);
    			add_location(br0, file$1, 65, 65, 1891);
    			attr_dev(div0, "class", "svelte-1hp0k0n");
    			add_location(div0, file$1, 63, 2, 1775);
    			attr_dev(label1, "for", "target");
    			attr_dev(label1, "class", "svelte-1hp0k0n");
    			add_location(label1, file$1, 70, 3, 2031);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "id", "target");
    			attr_dev(input1, "name", "target");
    			attr_dev(input1, "class", "svelte-1hp0k0n");
    			add_location(input1, file$1, 71, 3, 2105);
    			add_location(br1, file$1, 71, 75, 2177);
    			attr_dev(div1, "class", "svelte-1hp0k0n");
    			add_location(div1, file$1, 67, 2, 1909);
    			attr_dev(div2, "class", "svelte-1hp0k0n");
    			add_location(div2, file$1, 62, 1, 1765);
    			attr_dev(label2, "for", "symbol");
    			attr_dev(label2, "class", "svelte-1hp0k0n");
    			add_location(label2, file$1, 78, 2, 2244);
    			attr_dev(select, "class", "svelte-1hp0k0n");
    			add_location(select, file$1, 80, 3, 2387);
    			attr_dev(div3, "class", "svelte-1hp0k0n");
    			add_location(div3, file$1, 77, 1, 2235);
    			attr_dev(label3, "for", "stop_points_validation");
    			attr_dev(label3, "class", "svelte-1hp0k0n");
    			add_location(label3, file$1, 89, 1, 2628);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "id", "stop_points_validation");
    			attr_dev(input2, "class", "svelte-1hp0k0n");
    			add_location(input2, file$1, 90, 1, 2693);
    			attr_dev(label4, "for", "contracts_loaded");
    			attr_dev(label4, "class", "svelte-1hp0k0n");
    			add_location(label4, file$1, 93, 1, 2812);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "id", "contracts_loaded");
    			attr_dev(input3, "class", "svelte-1hp0k0n");
    			add_location(input3, file$1, 94, 1, 2871);
    			attr_dev(label5, "for", "risk_configuration");
    			attr_dev(label5, "class", "svelte-1hp0k0n");
    			add_location(label5, file$1, 97, 1, 2980);
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "id", "risk_configuration");
    			attr_dev(input4, "class", "svelte-1hp0k0n");
    			add_location(input4, file$1, 98, 1, 3039);
    			attr_dev(p, "class", "svelte-1hp0k0n");
    			add_location(p, file$1, 113, 4, 3553);
    			attr_dev(h1, "class", "svelte-1hp0k0n");
    			add_location(h1, file$1, 114, 1, 3580);
    			add_location(h2, file$1, 132, 1, 3970);
    			add_location(button0, file$1, 133, 1, 4006);
    			add_location(button1, file$1, 134, 1, 4074);
    			attr_dev(main, "class", "svelte-1hp0k0n");
    			add_location(main, file$1, 57, 0, 1747);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			set_input_value(input0, /*risk*/ ctx[1]);
    			append_dev(div0, t2);
    			append_dev(div0, br0);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, label1);
    			append_dev(label1, t4);
    			append_dev(label1, t5);
    			append_dev(label1, t6);
    			append_dev(div1, t7);
    			append_dev(div1, input1);
    			set_input_value(input1, /*ratio_value*/ ctx[2]);
    			append_dev(div1, br1);
    			append_dev(main, t8);
    			append_dev(main, div3);
    			append_dev(div3, label2);
    			append_dev(div3, t10);
    			append_dev(div3, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(select, null);
    				}
    			}

    			append_dev(main, t11);
    			append_dev(main, label3);
    			append_dev(main, t13);
    			append_dev(main, input2);
    			set_input_value(input2, /*stop_points_validation*/ ctx[4]);
    			append_dev(main, t14);
    			append_dev(main, label4);
    			append_dev(main, t16);
    			append_dev(main, input3);
    			set_input_value(input3, /*contracts_loaded*/ ctx[5]);
    			append_dev(main, t17);
    			append_dev(main, label5);
    			append_dev(main, t19);
    			append_dev(main, input4);
    			set_input_value(input4, /*risk_configuration*/ ctx[6]);
    			append_dev(main, t20);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t21);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t22);
    			append_dev(main, p);
    			append_dev(main, t24);
    			append_dev(main, h1);
    			append_dev(h1, t25);
    			append_dev(h1, t26);
    			append_dev(main, t27);
    			if (if_block2) if_block2.m(main, null);
    			append_dev(main, t28);
    			if (if_block3) if_block3.m(main, null);
    			append_dev(main, t29);
    			append_dev(main, h2);
    			append_dev(h2, t30);
    			append_dev(h2, t31);
    			append_dev(main, t32);
    			append_dev(main, button0);
    			append_dev(main, t34);
    			append_dev(main, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[11]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12]),
    					listen_dev(select, "change", /*handleSelect*/ ctx[10], false, false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[13]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[14]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[15]),
    					listen_dev(button0, "click", /*click_handler*/ ctx[16], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[17], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*risk*/ 2 && to_number(input0.value) !== /*risk*/ ctx[1]) {
    				set_input_value(input0, /*risk*/ ctx[1]);
    			}

    			if (dirty & /*risk_configuration*/ 64) set_data_dev(t5, /*risk_configuration*/ ctx[6]);

    			if (dirty & /*ratio_value*/ 4 && to_number(input1.value) !== /*ratio_value*/ ctx[2]) {
    				set_input_value(input1, /*ratio_value*/ ctx[2]);
    			}

    			if (dirty & /*symbol_values, symbol_val*/ 520) {
    				each_value = /*symbol_values*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*stop_points_validation*/ 16 && to_number(input2.value) !== /*stop_points_validation*/ ctx[4]) {
    				set_input_value(input2, /*stop_points_validation*/ ctx[4]);
    			}

    			if (dirty & /*contracts_loaded*/ 32 && to_number(input3.value) !== /*contracts_loaded*/ ctx[5]) {
    				set_input_value(input3, /*contracts_loaded*/ ctx[5]);
    			}

    			if (dirty & /*risk_configuration*/ 64 && to_number(input4.value) !== /*risk_configuration*/ ctx[6]) {
    				set_input_value(input4, /*risk_configuration*/ ctx[6]);
    			}

    			if (/*contracts_loaded*/ ctx[5] || /*stop_points_validation*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					if_block0.m(main, t21);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*contracts_loaded*/ ctx[5] || /*stop_points_validation*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					if_block1.m(main, t22);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*symbol_find_value*/ 128) set_data_dev(t25, /*symbol_find_value*/ ctx[7]);

    			if (/*risk*/ ctx[1] || /*value_in_money*/ ctx[8] || /*stop_points_validation*/ ctx[4]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					if_block2.m(main, t28);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*risk_configuration*/ ctx[6] || /*stop_points_validation*/ ctx[4]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block(ctx);
    					if_block3.c();
    					if_block3.m(main, t29);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (dirty & /*volume*/ 1) set_data_dev(t31, /*volume*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Calculator_comp', slots, []);
    	let risk = 200;
    	let ratio_value = 5;
    	let symbol_val = "MES";

    	const symbol_values = [
    		{ Symbol: 'MES', value_in_money: '5' },
    		{ Symbol: 'MNQ', value_in_money: '2' },
    		{ Symbol: 'MYM', value_in_money: '1' },
    		{ Symbol: 'M2K', value_in_money: '5' },
    		{ Symbol: 'FDXS', value_in_money: '1' },
    		{ Symbol: 'FSXE', value_in_money: '1' },
    		{ Symbol: 'ES', value_in_money: '50' },
    		{ Symbol: 'NQ', value_in_money: '20' },
    		{ Symbol: 'YM', value_in_money: '5' },
    		{ Symbol: 'RTY', value_in_money: '50' },
    		{ Symbol: 'EMD', value_in_money: '100' },
    		{ Symbol: 'NKD', value_in_money: '25' },
    		{ Symbol: 'CL', value_in_money: '1000' },
    		{ Symbol: 'QM', value_in_money: '500' },
    		{ Symbol: 'MCL', value_in_money: '100' },
    		{ Symbol: 'NG', value_in_money: '10000' },
    		{ Symbol: 'QG', value_in_money: '2500' },
    		{ Symbol: 'RB', value_in_money: '42000' },
    		{ Symbol: 'HO', value_in_money: '42000' },
    		{ Symbol: 'B', value_in_money: '1000' },
    		{ Symbol: 'T', value_in_money: '1000' },
    		{ Symbol: 'G', value_in_money: '20' }
    	];

    	let stop_points_validation = 10;
    	let contracts_loaded = 2;
    	let risk_configuration = 3;
    	let symbol_find_value = symbol_values.find(obj => obj.Symbol === symbol_val).value_in_money;
    	let value_in_money = symbol_values.find(obj => obj.Symbol === symbol_val).value_in_money;

    	function handleSelect(event) {
    		$$invalidate(3, symbol_val = event.target.value);
    		$$invalidate(7, symbol_find_value = symbol_values.find(obj => obj.Symbol === symbol_val).value_in_money);
    		$$invalidate(8, value_in_money = symbol_find_value);
    	}

    	let volume = 0;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Calculator_comp> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		risk = to_number(this.value);
    		$$invalidate(1, risk);
    	}

    	function input1_input_handler() {
    		ratio_value = to_number(this.value);
    		$$invalidate(2, ratio_value);
    	}

    	function input2_input_handler() {
    		stop_points_validation = to_number(this.value);
    		$$invalidate(4, stop_points_validation);
    	}

    	function input3_input_handler() {
    		contracts_loaded = to_number(this.value);
    		$$invalidate(5, contracts_loaded);
    	}

    	function input4_input_handler() {
    		risk_configuration = to_number(this.value);
    		$$invalidate(6, risk_configuration);
    	}

    	const click_handler = () => $$invalidate(0, volume += 1);
    	const click_handler_1 = () => $$invalidate(0, volume -= 1);

    	$$self.$capture_state = () => ({
    		risk,
    		ratio_value,
    		symbol_val,
    		symbol_values,
    		stop_points_validation,
    		contracts_loaded,
    		risk_configuration,
    		symbol_find_value,
    		value_in_money,
    		handleSelect,
    		volume
    	});

    	$$self.$inject_state = $$props => {
    		if ('risk' in $$props) $$invalidate(1, risk = $$props.risk);
    		if ('ratio_value' in $$props) $$invalidate(2, ratio_value = $$props.ratio_value);
    		if ('symbol_val' in $$props) $$invalidate(3, symbol_val = $$props.symbol_val);
    		if ('stop_points_validation' in $$props) $$invalidate(4, stop_points_validation = $$props.stop_points_validation);
    		if ('contracts_loaded' in $$props) $$invalidate(5, contracts_loaded = $$props.contracts_loaded);
    		if ('risk_configuration' in $$props) $$invalidate(6, risk_configuration = $$props.risk_configuration);
    		if ('symbol_find_value' in $$props) $$invalidate(7, symbol_find_value = $$props.symbol_find_value);
    		if ('value_in_money' in $$props) $$invalidate(8, value_in_money = $$props.value_in_money);
    		if ('volume' in $$props) $$invalidate(0, volume = $$props.volume);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*volume*/ 1) {
    			if (volume < 0) {
    				alert("can't go lower");
    			} else if (volume > 10) {
    				alert("can't go higher"); // volume = 0
    				$$invalidate(0, volume = 10);
    			}
    		}
    	};

    	return [
    		volume,
    		risk,
    		ratio_value,
    		symbol_val,
    		stop_points_validation,
    		contracts_loaded,
    		risk_configuration,
    		symbol_find_value,
    		value_in_money,
    		symbol_values,
    		handleSelect,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class Calculator_comp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Calculator_comp",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.58.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let table;
    	let tr0;
    	let th0;
    	let calculator_comp0;
    	let t2;
    	let th1;
    	let calculator_comp1;
    	let t3;
    	let th2;
    	let calculator_comp2;
    	let t4;
    	let th3;
    	let calculator_comp3;
    	let t5;
    	let tr1;
    	let current;
    	calculator_comp0 = new Calculator_comp({ $$inline: true });
    	calculator_comp1 = new Calculator_comp({ $$inline: true });
    	calculator_comp2 = new Calculator_comp({ $$inline: true });
    	calculator_comp3 = new Calculator_comp({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "💸 Risk Calculator";
    			t1 = space();
    			table = element("table");
    			tr0 = element("tr");
    			th0 = element("th");
    			create_component(calculator_comp0.$$.fragment);
    			t2 = space();
    			th1 = element("th");
    			create_component(calculator_comp1.$$.fragment);
    			t3 = space();
    			th2 = element("th");
    			create_component(calculator_comp2.$$.fragment);
    			t4 = space();
    			th3 = element("th");
    			create_component(calculator_comp3.$$.fragment);
    			t5 = space();
    			tr1 = element("tr");
    			attr_dev(h1, "id", "title");
    			attr_dev(h1, "class", "svelte-wcxq1q");
    			add_location(h1, file, 21, 1, 365);
    			add_location(th0, file, 24, 4, 448);
    			add_location(th1, file, 25, 4, 482);
    			add_location(th2, file, 26, 4, 516);
    			add_location(th3, file, 27, 4, 550);
    			add_location(tr0, file, 23, 2, 439);
    			add_location(tr1, file, 28, 2, 582);
    			set_style(table, "margin", "0 auto");
    			add_location(table, file, 22, 1, 405);
    			attr_dev(main, "class", "svelte-wcxq1q");
    			add_location(main, file, 18, 0, 308);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, table);
    			append_dev(table, tr0);
    			append_dev(tr0, th0);
    			mount_component(calculator_comp0, th0, null);
    			append_dev(tr0, t2);
    			append_dev(tr0, th1);
    			mount_component(calculator_comp1, th1, null);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			mount_component(calculator_comp2, th2, null);
    			append_dev(tr0, t4);
    			append_dev(tr0, th3);
    			mount_component(calculator_comp3, th3, null);
    			append_dev(table, t5);
    			append_dev(table, tr1);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calculator_comp0.$$.fragment, local);
    			transition_in(calculator_comp1.$$.fragment, local);
    			transition_in(calculator_comp2.$$.fragment, local);
    			transition_in(calculator_comp3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calculator_comp0.$$.fragment, local);
    			transition_out(calculator_comp1.$$.fragment, local);
    			transition_out(calculator_comp2.$$.fragment, local);
    			transition_out(calculator_comp3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(calculator_comp0);
    			destroy_component(calculator_comp1);
    			destroy_component(calculator_comp2);
    			destroy_component(calculator_comp3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Calculator_comp });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    // import App from './ifelse.svelte';
    // import App from './list_items.svelte';
    // import App from './counter__cliclk.svelte';
    // import App from './Form_handling.svelte';
    // import App from './5_reactive_declarations.svelte';



    // we run a constant
    const app = new App({
    	target: document.body,
    	props: {
    		// add the number
    		risk: 5
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

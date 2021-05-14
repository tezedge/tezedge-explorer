import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class TreeMapFactoryService {

  define(runtime, observer): any {
    const main = runtime.module();
    main.variable(observer()).define(['md'], (md) => md);
    main.variable(observer('chart'))
      .define(
        'chart',
        ['d3', 'width', 'height', 'treemap', 'data', 'DOM', 'color', 'tooltip', 'name', 'format'],
        (d3Library, width, height, treemap, data, DOM, color, tooltip, name, format) => {

          const x = d3Library.scaleLinear().rangeRound([0, width]);
          const y = d3Library.scaleLinear().rangeRound([0, height]);
          const svg = d3Library.create('svg')
            .attr('viewBox', [0.5, -30.5, width, height + 35])
            .style('font', '12px sans-serif');

          d3Library.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

          let group = svg.append('g')
            .call(render, treemap(data));

          function render(groupParam, root) {

            const node = groupParam
              .selectAll('g')
              .data(root.children.concat(root))
              .join('g');

            node.filter(d => d === root ? d.parent : d.children)
              .attr('cursor', 'pointer')
              .on('click', (event, d) => d === root ? zoomout(root) : zoomin(d));

            /* Smart zoom */
            // .on("wheel", function (event, d) {
            //     if (event.wheelDelta < 0) {
            //         if (d.depth === 1) {
            //             return d.children
            //         } else {
            //             zoomout(root)
            //         }
            //     } else {
            //         console.log(d)
            //         zoomin(d)
            //     }
            // });


            const myScale = d3Library.scaleLinear()
              .domain([0, d3Library.max(root.leaves().map(leaves => leaves.data.value))])
              .range([1, 0.4]).clamp(true);

            // tooltip
            // node.append("title")
            // .text(d => `${name(d)}\n${format(d.value)}`)

            node.append('rect')
              .attr('id', d => (d.leafUid = DOM.uid('leaf')).id)
              .attr('fill', d => {
                while (d.depth > 1) {
                  d = d.parent;
                }
                return d.data.color;
              })
              .attr('fill-opacity', d => d.depth <= 1 ? 0.6 : 0.6)
              // .attr("fill-opacity", d => {
              //  let min = d3Library.min(root.leaves().map(leaf => leaf.data.value))
              //  let max = d3Library.max(root.leaves().map(leaf => leaf.data.value))
              //  return (d.value-min)/(max-min)})
              // .attr('stroke', '#fff')
              .attr('stroke', d => {
                while (d.depth > 1) {
                  d = d.parent;
                }
                return d.data.color;
              })
              .on('mouseover', (d, dataSet) => {
                tooltip
                  .html('Value: ' + dataSet.value + '<br/>' + 'Name: ' + name(dataSet))
                  // .html(data.value + "<br/>" + name(data))
                  .style('visibility', 'visible');
              })
              .on('mousemove', (d) => {
                let left = d.clientX + 20;
                const maxLeftTooltipAllowed = runtime.setup.containerRect.right - tooltip._groups[0][0].offsetWidth;
                if (left > maxLeftTooltipAllowed) {
                  left = maxLeftTooltipAllowed;
                }

                tooltip
                  .style('top', d.clientY + 10 + 'px')
                  .style('left', left + 'px')
                  .style('display', 'inline-block');
              })
              .on('mouseout', () => tooltip.html(``).style('visibility', 'hidden'));

            node.append('clipPath')
              .attr('id', d => (d.clipUid = DOM.uid('clip')).id)
              .append('use')
              .attr('xlink:href', d => d.leafUid.href);

            node.append('text')
              .attr('clip-path', d => d.clipUid)
              .attr('font-weight', d => d === root ? 'bold' : null)
              .attr('pointer-events', 'none')
              .selectAll('tspan')
              .data(d =>
                (d === root ? name(d) : (d.data.name.functionName || d.data.name.virtualAddress))
                  .split(
                    // /(?=[A-Z][^A-Z])/g
                  ).concat(format(d.value))
              )
              .join('tspan')
              .attr('x', 3)
              .attr('y', (d, i, nodes) => `${(i === nodes.length - 1 ? 1 : 0) * 0.3 + 1.1 + i * 0.9}em`)
              .attr('fill', '#fff')
              .attr('fill-opacity', (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
              .attr('font-weight', (d, i, nodes) => i === nodes.length - 1 ? 'normal' : null)
              .text(d => d);

            groupParam.call(position, root);
          }

          function position(groupParam, root) {
            groupParam.selectAll('g')
              .attr('transform', d => d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`)
              .select('rect')
              .attr('width', d => d === root ? width : x(d.x1) - x(d.x0))
              .attr('height', d => d === root ? 30 : y(d.y1) - y(d.y0));
          }

          // When zooming in, draw the new nodes on top, and fade them in.
          function zoomin(d) {
            const group0 = group.attr('pointer-events', 'none');
            const group1 = group = svg.append('g').call(render, d);

            x.domain([d.x0, d.x1]);
            y.domain([d.y0, d.y1]);

            svg.transition()
              .duration(350)
              .call(t => group0.transition(t).remove()
                .call(position, d.parent))
              .call(t => group1.transition(t)
                .attrTween('opacity', () => d3Library.interpolate(0, 1))
                .call(position, d));
          }

          // When zooming out, draw the old nodes on top, and fade them out.
          function zoomout(d) {
            const group0 = group.attr('pointer-events', 'none');
            const group1 = group = svg.insert('g', '*').call(render, d.parent);

            x.domain([d.parent.x0, d.parent.x1]);
            y.domain([d.parent.y0, d.parent.y1]);

            svg.transition()
              .duration(350)
              .call(t => group0.transition(t).remove()
                .attrTween('opacity', () => d3Library.interpolate(1, 0))
                .call(position, d)
              )
              .call(t => group1.transition(t).call(position, d.parent));
          }

          /* External Zoom */
//           svg.call(d3Library.zoom()
//             .extent([[0, 0], [width, height]])
//             .scaleExtent([1, 8])
//             .on('zoom', zoomed));
//
//
//           function zoomed({ transform }) {
//             group.attr('transform', transform);
//           }


          return svg.node();
        }
      );
    main.variable(observer('data')).define('data', ['FileAttachment'], () => runtime.setup.treeData);
    main.variable(observer('treemap')).define('treemap', ['d3', 'tile'], (d3Library, tile) => {
      return data => d3Library.treemap()
        .tile(tile)
        (
          d3Library
            .hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value)
        );
    });
    main.variable(observer('tile')).define('tile', ['d3', 'width', 'height'], (d3Library, width, height) => {
      return function tile(node, x0, y0, x1, y1) {
        d3Library.treemapBinary(node, 0, 0, width, height);
        for (const child of node.children) {
          child.x0 = x0 + child.x0 / width * (x1 - x0);
          child.x1 = x0 + child.x1 / width * (x1 - x0);
          child.y0 = y0 + child.y0 / height * (y1 - y0);
          child.y1 = y0 + child.y1 / height * (y1 - y0);
        }
      };
    });
    main.variable(observer('tooltip')).define('tooltip', ['d3'], (d3Library) => {
      return d3Library
        .select('body')
        .append('div')
        .attr('class', 'd3-tooltip')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('padding', '10px')
        .style('background', 'rgba(0,0,0,0.6)')
        .style('border-radius', '4px')
        .style('color', '#fff')
        .text('a simple tooltip');
    });
    main.variable(observer('name')).define('name', () => {
      return d => d.ancestors().reverse().map(a => a.data.name).map(a => a.functionName || a.virtualAddress).join('/');
    });
    main.variable(observer('width')).define('width', () => {
      return runtime.setup.containerRect.width;
    });
    main.variable(observer('height')).define('height', () => {
      return runtime.setup.containerRect.height - 32;
    });
    main.variable(observer('format')).define('format', ['d3'], (d3Library) => {
      return d3Library.format(',d');
    });
    main.variable(observer('colors')).define('colors', () => {
      return (name) => {
        const colors = {
          flare: '#fff',
          analytics: '#596F7E',
          animate: '#168B98',
          data: '#ED5B67',
          display: '#fd8f24',
          flex: '#919c4c',
          physics: '#919c4c',
          query: '#fd8f24',
          scale: '#596F7E',
          util: '#919c4c',
          vis: '#919c4c',
          interpolate: '#168B98',
          methods: '#fd8f24'
        };
        return colors[name];
      };
    });
    main.variable(observer('color')).define('color', ['d3', 'treemap', 'data'], (d3Library, treemap, data) => {
      return d3Library.scaleOrdinal()
        .domain(treemap(data).leaves().map(d => d.parent.data.name.functionName || d.parent.data.name.virtualAddress))
        .range(d3Library.schemeCategory10);
    });
    main.variable(observer('d3')).define('d3', ['require'], (require) => require('d3@6'));
    return main;
  }

}

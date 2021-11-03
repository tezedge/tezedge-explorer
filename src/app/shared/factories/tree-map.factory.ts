import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class TreeMapFactory {

  define(runtime, observer): any {
    const main = runtime.module();
    main.variable(observer()).define(['md'], (md) => md);
    main.variable(observer('chart'))
      .define(
        'chart',
        ['d3', 'width', 'height', 'treemap', 'data', 'DOM', 'color', 'tooltip', 'name', 'format'],
        (d3Library, width, height, treemap, data, DOM, color, tooltip, name, format) => {

          const treemapData = treemap(data);
          const x = d3Library.scaleLinear().rangeRound([0, width]);
          const y = d3Library.scaleLinear().rangeRound([0, height]);
          const svg = d3Library.create('svg')
            .attr('viewBox', [0, 0, width, height])
            .style('font', '12px sans-serif');

          let group = svg.append('g')
            .call(render, treemapData);

          runtime.setup.zoomNode = (nodeName) => {
            const nodeToBeZoomed = findNodeByName(nodeName, treemapData);
            zoomIn(nodeToBeZoomed, false);
          };

          function findNodeByName(nodeName: string, node) {
            if (node.data.name.executableName === nodeName) {
              return node;
            } else if (node.children) {
              let found = null;
              node.children.forEach(item => {
                if (!found) {
                  found = findNodeByName(nodeName, item);
                }
              });

              return found;
            }

            return null;
          }

          function render(groupParam, root) {

            const node = groupParam
              .selectAll('g')
              .data(root.children)
              .join('g');

            node.filter(d => d === root ? d.parent : d.children)
              .attr('cursor', 'pointer')
              .on('click', (event, d) => d === root ? zoomOut(root) : zoomIn(d));

            /* Smart zoom */
            // .on("wheel", function (event, d) {
            //     if (event.wheelDelta < 0) {
            //         if (d.depth === 1) {
            //             return d.children
            //         } else {
            //             zoomOut(root)
            //         }
            //     } else {
            //         console.log(d)
            //         zoomIn(d)
            //     }
            // });

            // const myScale = d3Library.scaleLinear()
            //   .domain([0, d3Library.max(root.leaves().map(leaves => leaves.data.value))])
            //   .range([1, 0.4]).clamp(true);

            // tooltip
            // node.append("title")
            // .text(d => `${name(d)}\n${format(d.value)}`)

            node.append('rect')
              .attr('id', d => (d.leafUid = DOM.uid('leaf')).id)
              .attr('fill', d => d.data.color)
              // .attr('fill-opacity', () => 0.45)
              // .attr("fill-opacity", d => {
              //  let min = d3Library.min(root.leaves().map(leaf => leaf.data.value))
              //  let max = d3Library.max(root.leaves().map(leaf => leaf.data.value))
              //  return (d.value-min)/(max-min)})
              .attr('stroke', () => 'rgba(255, 255, 255, 0.2)')
              .attr('touch-action', 'none')
              .on('mouseover', (d, dataSet) => {
                tooltip
                  .html(`
                    <div style="padding: 8px 8px 2px 8px">
                      ${name(dataSet)}<br/>
                      <div style="margin-top: 5px">${dataSet.value} mb<span class="foreground-4"> size</span></div>
                    </div>
                    <div style="border-top: 1px solid rgb(27, 27, 29); padding: 6px 8px 8px 8px; margin-top: 4px;">
                      ${dataSet.children ? dataSet.children.length : 0}<span class="foreground-4"> children</span>
                    </div>
                  `)
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
              .attr('visibility', d => x(d.x1) - x(d.x0) < 80 || y(d.y1) - y(d.y0) < 60 ? 'hidden' : '')
              .selectAll('tspan')
              .data(d =>
                d.data.name.executableName
                  .split(
                    // /(?=[A-Z][^A-Z])/g
                  )
                  .concat([d.value + ' mb'])
              )
              .join('tspan')
              .attr('x', 7)
              .attr('y', (d, i, nodes) => {
                const amplifier = i === nodes.length - 1 ? 1.6 : 0;
                return `${0.5 + (amplifier * 0.3 + 1.1 + i * 0.9)}em`;
              })
              .attr('fill', '#fff')
              .attr('fill-opacity', (d, i, nodes) => i === nodes.length - 2 ? 0.7 : null)
              .attr('font-weight', (d, i, nodes) => i === nodes.length - 2 ? 'normal' : null)
              .text(d => d);

            const g = node.append('g');
            g
              .attr('class', () => 'nested')
              .attr('visibility', d => x(d.x1) - x(d.x0) < 80 || y(d.y1) - y(d.y0) < 60 ? 'hidden' : '');
            g.append('circle')
              .attr('cx', d => d.data.children && d.data.children.length > 9 ? 18 : 15)
              .attr('cy', () => 50)
              .attr('r', d => d.data.children && d.data.children.length > 9 ? 11 : 8)
              .attr('fill', 'rgba(255,255,255,0.2)');

            g.append('text')
              .attr('fill', '#fff')
              .attr('x', () => 12)
              .attr('y', () => 54)
              .text(d => d.data.children ? d.data.children.length : 0);

            groupParam.call(position, root);
          }

          function position(groupParam, root) {
            const g = groupParam.selectAll('g:not(.nested)');
            g
              .attr('transform', d => `translate(${x(d.x0)},${y(d.y0)})`)
              .select('rect')
              .attr('width', d => d === root ? 0 : x(d.x1) - x(d.x0))
              .attr('height', d => d === root ? 0 : y(d.y1) - y(d.y0));
            g
              .select('text')
              .attr('visibility', d => x(d.x1) - x(d.x0) < 80 || y(d.y1) - y(d.y0) < 60 ? 'hidden' : '');

            groupParam.selectAll('g.nested')
              .attr('visibility', d => x(d.x1) - x(d.x0) < 80 || y(d.y1) - y(d.y0) < 60 ? 'hidden' : '');
          }

          // When zooming in, draw the new nodes on top, and fade them in.
          function zoomIn(d, dispatch: boolean = true) {
            const group0 = group.attr('pointer-events', 'none');
            const group1 = group = svg.append('g').call(render, d);

            x.domain([d.x0, d.x1]);
            y.domain([d.y0, d.y1]);

            svg.transition()
              .duration(250)
              .call(t => group0.transition(t)
                .attrTween('opacity', () => d3Library.interpolate(1, 0))
                .remove()
                .call(position, d.parent)
              )
              .call(t => group1.transition(t)
                .attrTween('opacity', () => d3Library.interpolate(0, 1))
                .call(position, d));
            if (dispatch) {
              runtime.setup.nodeZoomed(d.data);
            }
          }

          // When zooming out, draw the old nodes on top, and fade them out.
          function zoomOut(d) {
            const group0 = group.attr('pointer-events', 'none');
            const group1 = group = svg.insert('g', '*').call(render, d.parent);

            x.domain([d.parent.x0, d.parent.x1]);
            y.domain([d.parent.y0, d.parent.y1]);

            svg.transition()
              .duration(250)
              .call(t => group0.transition(t).remove()
                .attrTween('opacity', () => d3Library.interpolate(1, 0))
                .call(position, d)
              )
              .call(t => group1.transition(t)
                .attrTween('opacity', () => d3Library.interpolate(0, 1))
                .call(position, d.parent));

            runtime.setup.nodeZoomed(d.parent.data);
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
      return data => {

        const hierarchy = d3Library.hierarchy(data);

        function appendHierarchyValue(tree: any) {
          tree.value = tree.data.value;
          if (tree.children) {
            tree.children.forEach(child => {
              appendHierarchyValue(child);
            });
          }
        }

        appendHierarchyValue(hierarchy);
        return d3Library.treemap()
          .tile(tile)
          (
            hierarchy
              .sort((a, b) => b.value - a.value)
          );
      };
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
        .style('max-width', '50%')
        .style('font-size', '12px')
        .style('box-shadow', '0 4px 4px rgba(0, 0, 0, 0.25)')
        .style('visibility', 'hidden')
        .style('color', 'rgba(255, 255, 255, 0.4)')
        .style('background', '#2a2a2e')
        .style('border-radius', '4px')
        .style('color', '#fff');
    });
    main.variable(observer('name')).define('name', () => {
      return d => d.ancestors().reverse().map(a => a.data.name.executableName).join('/');
    });
    main.variable(observer('width')).define('width', () => {
      return runtime.setup.containerRect.width;
    });
    main.variable(observer('height')).define('height', () => {
      return runtime.setup.containerRect.height;
    });
    main.variable(observer('format')).define('format', ['d3'], (d3Library) => {
      return d3Library.format(',d');
    });
    main.variable(observer('color')).define('color', ['d3', 'treemap', 'data'], (d3Library, treemap, data) => {
      return d3Library.scaleOrdinal()
        .domain(treemap(data).leaves().map(d => d.parent.data.name.executableName))
        .range(d3Library.schemeCategory10);
    });
    main.variable(observer('d3')).define('d3', ['require'], (require) => require('d3@6'));
    return main;
  }

}

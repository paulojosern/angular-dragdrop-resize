import { Component, ElementRef, AfterViewInit, ViewChild, OnInit, ViewChildren, QueryList, Pipe, PipeTransform, Directive, Input, ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from '@angular/core';
import interact from 'interactjs';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag
} from "@angular/cdk/drag-drop";
import { Sortable } from '@shopify/draggable';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'interactjs';

  @ViewChild('header')
  headerRef: ElementRef | undefined
  @ViewChildren('nowItem', { read: ElementRef }) nowItems: QueryList<ElementRef> | undefined;

  startingWidth: any
  startingHeight: any
  sidebar: any
  main: any


  dragSource: any

  constructor(private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.startingWidth = document?.getElementById('td1')?.offsetWidth;
    this.startingHeight = document?.getElementById('td1')?.offsetHeight;



  }


  handleDragOver(evt: any) {
    evt.dataTransfer.dropEffect = 'move';
    evt.preventDefault();
  }

  handleDragEnter(evt: any) {
    evt.target.classList.add('over');
  }

  handleDragLeave(evt: any) {
    evt.target.classList.remove('over');
  }

  handleDragEnd() {
    const cols = document.querySelectorAll('.card');

    cols.forEach(col => {
      ['over', 'dragging'].forEach(function (className) {
        col.classList.remove(className);
      });
    })
  }


  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges()

    const cols = document.querySelectorAll('.card');

    Array.prototype.forEach.call(cols, (col) => {
      col.addEventListener('dragstart',
        (evt: any) => {
          this.dragSource = evt.target;
          evt.target.classList.add('dragging');
          evt.dataTransfer.effectAllowed = 'move';
          evt.dataTransfer.setData('text/html', this.dragSource.innerHTML);
        }
        , false);
      col.addEventListener('dragenter', this.handleDragEnter, false)
      col.addEventListener('dragover', this.handleDragOver, false);
      col.addEventListener('dragleave', this.handleDragLeave, false);
      col.addEventListener('drop', (evt: any) => {
        evt.stopPropagation();
        if (this.dragSource !== evt.target) {
          this.dragSource.innerHTML = evt.target.innerHTML;
          evt.target.innerHTML = evt.dataTransfer.getData('text/html');
        }
        evt.preventDefault();
      }, false);
      col.addEventListener('dragend', this.handleDragEnd, false);
    });



    interact(this.headerRef?.nativeElement).resizable({
      edges: {
        top: false, // Use pointer coords to check for resize.
        left: false, // Disable resizing from left edge.
        bottom: false, // Resize if pointer target matches selector
        right: '.resize-s', // Resize if pointer target is the given Element
      },
      listeners: {
        move: function (event) {
          let { x, y } = event.target.dataset;

          x = (parseFloat(x) || 0) + event.deltaRect.left;
          y = (parseFloat(y) || 0) + event.deltaRect.top;

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            transform: `translate(${x}px, ${y}px)`,
          });

          Object.assign(event.target.dataset, { x, y });
        },
      },
    });



    interact('.resize-drag')
      .resizable({
        edges: {
          left: true,
          right: true,
          bottom: true,
          top: true,
        },
        squareResize: true,
      })
      .on('resizemove', (event) => {
        var target = event.target;
        //console.log('target resize: ' + event.target);

        // If the user hits the hard bound limits you do not want to allow them to resize further
        if (
          event.rect.width > this.startingWidth * 0.75 + this.startingWidth ||
          event.rect.height > this.startingHeight * 0.75 + this.startingHeight
        ) {
          console.log('invalid lower bound dimensions...');
        } else if (
          event.rect.width < this.startingWidth - this.startingWidth * 0.75 ||
          event.rect.height < this.startingHeight - this.startingHeight * 0.75
        )
          console.log('invalid upper bound dimensions...');
        else {
          target.style.width = event.rect.width + 'px';
          target.style.height = event.rect.height + 'px';
        }
      });
  }

  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  // }
  // dropIn(evt: any) {
  //   // console.log(evt.container, evt.previousContainer);
  // }
  // drop(event: CdkDragDrop<any[]>) {
  //   const nodeToMove = event.item.element.nativeElement;
  //   const { previousContainer, container, previousIndex, currentIndex } = event;

  //   if (previousContainer === container) {
  //     moveItemInArray(container.data, previousIndex, currentIndex);

  //     moveWithinContainer(
  //       container.element.nativeElement,
  //       previousIndex,
  //       currentIndex
  //     );
  //   } else {
  //     transferArrayItem(
  //       previousContainer.data,
  //       container.data,
  //       previousIndex,
  //       currentIndex
  //     );
  //     transferNodeToContainer(
  //       nodeToMove,
  //       container.element.nativeElement,
  //       currentIndex
  //     );

  //     Promise.resolve().then(() => {
  //       previousContainer.removeItem(event.item);
  //       event.item.dropContainer = container;
  //       event.item._dragRef._withDropContainer(container._dropListRef);
  //       container.addItem(event.item);
  //     });
  //   }
  // }


}


import { Component, OnInit } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from "@angular/material/tree";
import { SharedService, Spell } from "../shared/shared.service";

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {
  constructor(private service: SharedService) {}

  private sortOptions: Array<String> = ["By school", "By level"];
  private charClass: string = "";
  private spells: Spell[] = [];
  private sortBy: string = "level";
  private spellsTreeSortedByLevel = [];
  private spellsTreeSortedBySchool = [];

  // Variables required for Material data tree
  private _transformer = (node, level) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level
    };
  };
  private treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );
  private treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );
  private dataSource = new MatTreeFlatDataSource(
    this.treeControl,
    this.treeFlattener
  );
  hasChild = (_: number, node: FlatNode) => node.expandable;

  ngOnInit() {
    this.spells = this.service.spells;
    this.charClass = this.service.charClass;
    this.sortSpellsByLevel();
    this.sortSpellsBySchool();

    this.dataSource.data = this.spellsTreeSortedBySchool;
  }

  transformToDataTree(sortedSpells) {
    let sortedSpellsKeys = Object.keys(sortedSpells);
    let TREE_DATA = [];
    for (let i = 0; i < sortedSpellsKeys.length; i++) {
      TREE_DATA.push({
        name: sortedSpellsKeys[i],
        children: [...sortedSpells[sortedSpellsKeys[i]]]
      });
    }
    return TREE_DATA;
  }

  sortSpellsByLevel() {
    let sortedSpells = {};
    for (let i = 0; i < this.spells.length; i++) {
      const idx = this.spells[i].classes.findIndex(
        charClass => charClass.name == this.charClass
      );
      if (idx !== -1) {
        const currLvl = `${this.spells[i].classes[idx].level} lvl`;
        const existingLvls = Object.keys(sortedSpells);
        if (existingLvls.includes(currLvl)) {
          sortedSpells[currLvl].push({ name: this.spells[i].name });
        } else {
          sortedSpells[currLvl] = [];
          sortedSpells[currLvl].push({ name: this.spells[i].name });
        }
      }
    }
    this.spellsTreeSortedByLevel = this.transformToDataTree(sortedSpells);
  }

  sortSpellsBySchool() {
    let sortedSpells = {};
    for (let i = 0; i < this.spells.length; i++) {
      const currSchool = this.spells[i].school;
      const existingSchools = Object.keys(sortedSpells);
      if (existingSchools.includes(currSchool)) {
        sortedSpells[currSchool].push({ name: this.spells[i].name });
      } else {
        sortedSpells[currSchool] = [];
        sortedSpells[currSchool].push({ name: this.spells[i].name });
      }
    }
    this.spellsTreeSortedBySchool = this.transformToDataTree(sortedSpells);
  }

  handleGoToSelectClassClick() {
    this.service.handleGoToSelectClassClick();
  }
}
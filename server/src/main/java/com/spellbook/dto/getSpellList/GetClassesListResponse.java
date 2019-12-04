package com.spellbook.dto.getSpellList;

import com.spellbook.dto.common.Class;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GetClassesListResponse {

    private List<Class> classesList;
}

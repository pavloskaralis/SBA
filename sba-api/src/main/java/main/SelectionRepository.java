package main;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SelectionRepository extends JpaRepository <Selection, Integer>{


}
